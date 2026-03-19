from __future__ import annotations

import os
import smtplib
import ssl
from email.message import EmailMessage

from runtime_settings import get_mail_settings


def _get_mail_config() -> dict[str, str]:
    runtime_mail = get_mail_settings()
    return {
        "smtp_host": str(runtime_mail.get("smtp_host", "")).strip()
        or os.getenv("MAIL_SMTP_HOST", os.getenv("BACKFILL_ALERT_SMTP_HOST", "")).strip(),
        "smtp_port": str(runtime_mail.get("smtp_port", "")).strip()
        or str(os.getenv("MAIL_SMTP_PORT", os.getenv("BACKFILL_ALERT_SMTP_PORT", "587"))).strip(),
        "smtp_user": str(runtime_mail.get("smtp_user", "")).strip()
        or os.getenv("MAIL_SMTP_USER", os.getenv("BACKFILL_ALERT_SMTP_USER", "")).strip(),
        "smtp_password": str(runtime_mail.get("smtp_password", "")).strip()
        or os.getenv("MAIL_SMTP_PASSWORD", os.getenv("BACKFILL_ALERT_SMTP_PASSWORD", "")).strip(),
        "smtp_from": str(runtime_mail.get("smtp_from", "")).strip()
        or os.getenv("MAIL_EMAIL_FROM", os.getenv("BACKFILL_ALERT_EMAIL_FROM", "")).strip(),
        "portal_url": os.getenv("CMS_PORTAL_URL", "https://image.cloudon.gr/admin/").strip(),
        "products_url": os.getenv("PRODUCTS_API_URL", "https://image.cloudon.gr/api/products").strip(),
        "products_internal_url": os.getenv("PRODUCTS_INTERNAL_API_URL", "https://image.cloudon.gr/api/products_internal").strip(),
        "starttls": str(runtime_mail.get("starttls", True)).strip(),
    }


def send_api_client_credentials_email(
    *,
    to_email: str,
    client_name: str,
    api_username: str,
    api_password: str,
    api_domain: str = "",
) -> None:
    config = _get_mail_config()
    smtp_host = config["smtp_host"]
    smtp_from = config["smtp_from"]
    smtp_port = int(config["smtp_port"] or "587")
    smtp_user = config["smtp_user"]
    smtp_password = config["smtp_password"]
    use_tls = str(config.get("starttls", "")).strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }

    if not all([smtp_host, smtp_from, to_email.strip()]):
        raise RuntimeError("SMTP settings incomplete")

    label = api_domain or client_name or api_username
    subject = f"CloudOn API credentials updated for {label}"
    body = (
        f"Hello,\n\n"
        f"The CloudOn API credentials for client '{label}' were updated.\n\n"
        f"Username: {api_username}\n"
        f"Password: {api_password}\n\n"
        f"API endpoints:\n"
        f"- {config['products_url']}\n"
        f"- {config['products_internal_url']}\n\n"
        f"Admin portal:\n"
        f"- {config['portal_url']}\n\n"
        f"Please store these credentials securely.\n"
    )

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = smtp_from
    msg["To"] = to_email.strip()
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
