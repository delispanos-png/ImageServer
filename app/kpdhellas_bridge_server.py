from __future__ import annotations

import json
import os
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from urllib.parse import urlparse


HOST = os.getenv("KPDHELLAS_BRIDGE_HOST", "0.0.0.0")
PORT = int(os.getenv("KPDHELLAS_BRIDGE_PORT", "8765"))
USER_AGENT = os.getenv(
    "KPDHELLAS_BRIDGE_USER_AGENT",
    (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
)
MAX_TIME_SECONDS = int(os.getenv("KPDHELLAS_BRIDGE_MAX_TIME_SECONDS", "25"))
ALLOWED_HOSTS = {"kpdhellas.gr", "www.kpdhellas.gr"}


class BridgeError(Exception):
    pass


def _validate_target_url(url: str) -> str:
    url = str(url or "").strip()
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        raise BridgeError("Unsupported URL scheme")
    if parsed.netloc.lower() not in ALLOWED_HOSTS:
        raise BridgeError("Unsupported host")
    return url


def _curl_fetch_bytes(url: str, referer: str = "") -> bytes:
    command = [
        "curl",
        "-L",
        "-sS",
        "--compressed",
        "--max-time",
        str(MAX_TIME_SECONDS),
        "-A",
        USER_AGENT,
        url,
    ]
    if referer:
        command.extend(["-H", f"Referer: {referer}"])

    try:
        completed = subprocess.run(command, capture_output=True, check=False, timeout=MAX_TIME_SECONDS + 5)
    except subprocess.TimeoutExpired as exc:
        raise BridgeError(f"curl timeout after {MAX_TIME_SECONDS + 5}s") from exc

    if completed.returncode != 0:
        stderr = completed.stderr.decode("utf-8", "ignore").strip()
        raise BridgeError(stderr or f"curl failed with exit {completed.returncode}")

    return completed.stdout or b""


class KpdHellasBridgeHandler(BaseHTTPRequestHandler):
    server_version = "KpdHellasBridge/1.0"

    def _send_json(self, status_code: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise BridgeError("Invalid JSON body") from exc
        if not isinstance(parsed, dict):
            raise BridgeError("JSON body must be an object")
        return parsed

    def do_GET(self) -> None:  # noqa: N802
        if self.path.rstrip("/") == "/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "service": "kpdhellas_bridge",
                    "host": HOST,
                    "port": PORT,
                },
            )
            return
        self._send_json(404, {"ok": False, "detail": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        try:
            payload = self._read_json_body()
            url = _validate_target_url(payload.get("url", ""))
            referer = str(payload.get("referer", "") or "").strip()
        except BridgeError as exc:
            self._send_json(400, {"ok": False, "detail": str(exc)})
            return

        try:
            content = _curl_fetch_bytes(url, referer=referer)
        except BridgeError as exc:
            self._send_json(502, {"ok": False, "detail": str(exc)})
            return

        if self.path == "/fetch-text":
            self._send_json(
                200,
                {
                    "ok": True,
                    "url": url,
                    "text": content.decode("utf-8", "ignore"),
                },
            )
            return

        if self.path == "/download-image":
            self.send_response(200)
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        self._send_json(404, {"ok": False, "detail": "Not found"})

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003
        message = format % args
        sys.stderr.write(f"[kpdhellas_bridge] {self.address_string()} - {message}\n")


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), KpdHellasBridgeHandler)
    print(f"KpdHellas bridge listening on {HOST}:{PORT}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
