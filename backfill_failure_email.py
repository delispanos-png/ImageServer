#!/usr/bin/env python3
import os
import smtplib
import ssl
import sys
from email.message import EmailMessage
from pathlib import Path


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if key and key not in os.environ:
            os.environ[key] = value


def main() -> int:
    if len(sys.argv) < 5:
        print("usage: backfill_failure_email.py <unit> <result> <exit_code> <exit_status>", file=sys.stderr)
        return 2

    load_env_file(Path("/home/imageuser/imageDataAPI/.env"))

    smtp_host = os.getenv("BACKFILL_ALERT_SMTP_HOST", "").strip()
    smtp_port = int(os.getenv("BACKFILL_ALERT_SMTP_PORT", "587"))
    smtp_user = os.getenv("BACKFILL_ALERT_SMTP_USER", "").strip()
    smtp_password = os.getenv("BACKFILL_ALERT_SMTP_PASSWORD", "").strip()
    smtp_from = os.getenv("BACKFILL_ALERT_EMAIL_FROM", "").strip()
    smtp_to = os.getenv("BACKFILL_ALERT_EMAIL_TO", "").strip()
    use_tls = os.getenv("BACKFILL_ALERT_SMTP_STARTTLS", "true").strip().lower() in {"1", "true", "yes", "on"}

    if not all([smtp_host, smtp_from, smtp_to]):
        print("backfill alert email skipped: smtp settings incomplete", file=sys.stderr)
        return 0

    unit, result, exit_code, exit_status = sys.argv[1:5]

    subject = f"[ALERT] {unit} stopped with result={result}"
    body = (
        f"Unit: {unit}\n"
        f"Result: {result}\n"
        f"ExitCode: {exit_code}\n"
        f"ExitStatus: {exit_status}\n"
        f"Host: {os.uname().nodename}\n"
    )

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = smtp_to
    msg.set_content(body)

    if use_tls:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            if smtp_user:
                server.login(smtp_user, smtp_password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
            if smtp_user:
                server.login(smtp_user, smtp_password)
            server.send_message(msg)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
