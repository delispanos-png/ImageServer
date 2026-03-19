from __future__ import annotations

import os
from typing import Any, Dict, List
from urllib.parse import quote

import aiohttp

from runtime_settings import (
    get_xml_client_settings,
    get_xml_settings,
    is_xml_client_enabled,
    is_xml_service_enabled,
)


DEFAULT_TIMEOUT_SECONDS = int(os.getenv("XML_SERVICE_TIMEOUT_SECONDS", "20"))


def _default_last_run() -> Dict[str, Any]:
    return {
        "status": "idle",
        "started_at": "",
        "finished_at": "",
        "message": "",
        "requested_domain": "",
        "requested_domains": [],
        "mode": "",
        "cron_time": "",
        "results": [],
        "errors": [],
    }


def _default_status() -> Dict[str, Any]:
    return {
        "reachable": False,
        "error": "",
        "running": False,
        "service_started_at": "",
        "configured_clients": [],
        "outputs": [],
        "last_run": _default_last_run(),
    }


def get_effective_xml_service_url() -> str:
    settings = get_xml_settings()
    raw = str(settings.get("service_url", "")).strip() or os.getenv("XML_SERVICE_URL", "http://xml_generator").strip()
    return raw.rstrip("/")


def get_effective_xml_public_base_url() -> str:
    settings = get_xml_settings()
    raw = str(settings.get("public_base_url", "")).strip() or os.getenv("XML_PUBLIC_BASE_URL", "/api/xml_generator").strip()
    return raw.rstrip("/")


def build_public_xml_url(domain: str, file_name: str) -> str:
    base = get_effective_xml_public_base_url()
    return f"{base}/{quote(domain, safe='')}/{quote(file_name, safe='')}"


def _normalize_requested_domains(raw_value: Any, fallback_domain: str = "") -> List[str]:
    domains: List[str] = []
    seen: set[str] = set()

    def add_domain(value: Any) -> None:
        normalized = str(value or "").strip()
        if not normalized or normalized in seen:
            return
        seen.add(normalized)
        domains.append(normalized)

    if isinstance(raw_value, list):
        for item in raw_value:
            add_domain(item)
    add_domain(fallback_domain)
    return domains


def _normalize_configured_clients(raw_clients: Any) -> List[Dict[str, Any]]:
    overrides = get_xml_client_settings()
    normalized_rows: List[Dict[str, Any]] = []
    if not isinstance(raw_clients, list):
        return normalized_rows

    for row in raw_clients:
        if not isinstance(row, dict):
            continue
        domain = str(row.get("domain", "")).strip()
        if not domain:
            continue
        override = overrides.get(domain, {})
        normalized_rows.append(
            {
                "domain": domain,
                "function_name": str(row.get("function_name", "")).strip(),
                "company": str(row.get("company", "")).strip(),
                "solution_type": str(row.get("solution_type", "")).strip(),
                "enabled": bool(override.get("enabled", True)),
                "updated_at": str(override.get("updated_at", "")).strip(),
                "updated_by": str(override.get("updated_by", "")).strip(),
            }
        )
    return normalized_rows


def _enabled_domains(configured_clients: List[Dict[str, Any]]) -> List[str]:
    return [
        str(row.get("domain", "")).strip()
        for row in configured_clients
        if str(row.get("domain", "")).strip() and bool(row.get("enabled", True))
    ]


def _normalize_last_run(raw_last_run: Any) -> Dict[str, Any]:
    normalized = _default_last_run()
    if not isinstance(raw_last_run, dict):
        return normalized

    normalized.update(raw_last_run)
    normalized["requested_domain"] = str(raw_last_run.get("requested_domain", "")).strip()
    normalized["requested_domains"] = _normalize_requested_domains(
        raw_last_run.get("requested_domains", []),
        normalized["requested_domain"],
    )
    return normalized


async def fetch_xml_service_status(configured_clients: List[Dict[str, Any]] | None = None) -> Dict[str, Any]:
    status = _default_status()
    service_url = get_effective_xml_service_url()
    if not service_url:
        status["error"] = "XML service URL is not configured."
        return status

    timeout = aiohttp.ClientTimeout(total=DEFAULT_TIMEOUT_SECONDS)
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(f"{service_url}/internal/status") as response:
                if response.status >= 400:
                    status["error"] = f"XML service returned status {response.status}."
                    return status
                payload = await response.json(content_type=None)
    except Exception as exc:
        status["error"] = str(exc)
        return status

    data = payload.get("data") if isinstance(payload, dict) else {}
    if not isinstance(data, dict):
        status["error"] = "XML service returned an invalid payload."
        return status

    configured_client_source = configured_clients if configured_clients is not None else data.get("configured_clients", [])
    normalized_configured_clients = _normalize_configured_clients(configured_client_source)
    enabled_domain_set = set(_enabled_domains(normalized_configured_clients))
    outputs = data.get("outputs", [])

    normalized_outputs: List[Dict[str, Any]] = []
    if isinstance(outputs, list):
        for group in outputs:
            if not isinstance(group, dict):
                continue
            domain = str(group.get("domain", "")).strip()
            if not domain or domain not in enabled_domain_set:
                continue
            files_payload = group.get("files", [])
            files: List[Dict[str, str]] = []
            if isinstance(files_payload, list):
                for file_row in files_payload:
                    if not isinstance(file_row, dict):
                        continue
                    file_name = str(file_row.get("name", "")).strip()
                    if not file_name:
                        continue
                    files.append({"name": file_name, "url": build_public_xml_url(domain, file_name)})
            if files:
                normalized_outputs.append({"domain": domain, "files": files})

    status.update(
        {
            "reachable": True,
            "error": "",
            "running": bool(data.get("running", False)),
            "service_started_at": str(data.get("service_started_at", "")).strip(),
            "configured_clients": normalized_configured_clients,
            "outputs": normalized_outputs,
            "last_run": _normalize_last_run(data.get("last_run", {})),
        }
    )
    return status


async def trigger_xml_generation(
    configured_clients: List[Dict[str, Any]],
    generator_clients: List[Dict[str, Any]],
    domain: str = "",
    mode: str = "full",
) -> Dict[str, Any]:
    if not is_xml_service_enabled():
        raise RuntimeError("XML service is disabled in runtime settings.")

    service_url = get_effective_xml_service_url()
    if not service_url:
        raise RuntimeError("XML service URL is not configured.")

    status = await fetch_xml_service_status(configured_clients=configured_clients)
    if not bool(status.get("reachable", False)):
        raise RuntimeError(str(status.get("error", "XML service is not reachable.")).strip() or "XML service is not reachable.")

    configured_clients = status.get("configured_clients", [])
    generator_clients_by_domain = {
        str(row.get("domain", "")).strip(): row
        for row in generator_clients
        if isinstance(row, dict) and str(row.get("domain", "")).strip()
    }
    requested_domain = str(domain or "").strip()
    requested_domains: List[str]
    payload: Dict[str, Any] = {"mode": mode}

    if requested_domain:
        matching_client = next(
            (row for row in configured_clients if str(row.get("domain", "")).strip() == requested_domain),
            None,
        )
        if not matching_client:
            raise RuntimeError("Unknown XML domain.")
        if not bool(matching_client.get("enabled", True)):
            raise RuntimeError(f"XML client {requested_domain} is disabled.")
        requested_domains = [requested_domain]
        payload["domain"] = requested_domain
    else:
        requested_domains = _enabled_domains(configured_clients)
        if not requested_domains:
            raise RuntimeError("No enabled XML clients are configured.")
        if len(requested_domains) == 1:
            payload["domain"] = requested_domains[0]
        else:
            payload["domains"] = requested_domains

    payload_clients = [
        generator_clients_by_domain[domain_name]
        for domain_name in requested_domains
        if domain_name in generator_clients_by_domain
    ]
    if not payload_clients:
        raise RuntimeError("No XML generator clients are configured for the requested domains.")
    payload["clients"] = payload_clients

    timeout = aiohttp.ClientTimeout(total=DEFAULT_TIMEOUT_SECONDS)
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(f"{service_url}/internal/generate", json=payload) as response:
                if response.status >= 400:
                    try:
                        error_payload = await response.json(content_type=None)
                        detail = str(error_payload.get("detail", "")).strip()
                    except Exception:
                        detail = (await response.text()).strip()
                    raise RuntimeError(detail or f"XML service returned status {response.status}.")
                response_payload = await response.json(content_type=None)
    except RuntimeError:
        raise
    except Exception as exc:
        raise RuntimeError(str(exc)) from exc

    data = response_payload.get("data") if isinstance(response_payload, dict) else {}
    if not isinstance(data, dict):
        raise RuntimeError("XML service returned an invalid payload.")

    response_requested_domain = str(data.get("requested_domain", requested_domain if len(requested_domains) == 1 else "")).strip()
    response_requested_domains = _normalize_requested_domains(
        data.get("requested_domains", requested_domains),
        response_requested_domain,
    )

    return {
        "started": bool(data.get("started", False)),
        "already_running": bool(data.get("already_running", False)),
        "requested_domain": response_requested_domain,
        "requested_domains": response_requested_domains,
        "mode": str(data.get("mode", mode)).strip(),
        "cron_time": str(data.get("cron_time", "")).strip(),
    }


async def fetch_xml_file(domain: str, marketplace_xml: str) -> Dict[str, Any]:
    if not is_xml_service_enabled():
        raise RuntimeError("XML service is disabled in runtime settings.")
    if not is_xml_client_enabled(domain):
        raise RuntimeError(f"XML client {str(domain or '').strip()} is disabled.")

    service_url = get_effective_xml_service_url()
    if not service_url:
        raise RuntimeError("XML service URL is not configured.")

    timeout = aiohttp.ClientTimeout(total=DEFAULT_TIMEOUT_SECONDS)
    target_url = f"{service_url}/xml_generator/{quote(domain, safe='')}/{quote(marketplace_xml, safe='')}"

    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(target_url) as response:
                if response.status == 404:
                    raise FileNotFoundError("XML file not found.")
                if response.status >= 400:
                    detail = (await response.text()).strip()
                    raise RuntimeError(detail or f"XML service returned status {response.status}.")
                return {
                    "content": await response.read(),
                    "content_type": response.headers.get("Content-Type", "application/xml"),
                }
    except FileNotFoundError:
        raise
    except RuntimeError:
        raise
    except Exception as exc:
        raise RuntimeError(str(exc)) from exc
