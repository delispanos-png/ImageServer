from __future__ import annotations

import os
from typing import Optional

from cryptography.fernet import Fernet, InvalidToken

_FERNET: Optional[Fernet] = None
_ENCRYPTED_PREFIX = "fernet:v1:"


def _get_fernet() -> Optional[Fernet]:
    global _FERNET
    if _FERNET is not None:
        return _FERNET
    key = os.getenv("CMS_SECRET_VAULT_KEY", "").strip()
    if not key:
        return None
    try:
        _FERNET = Fernet(key.encode("utf-8"))
    except Exception as exc:
        raise RuntimeError(f"Invalid CMS_SECRET_VAULT_KEY: {exc}") from exc
    return _FERNET


def encrypt_secret(plaintext: str) -> str:
    if not plaintext:
        return ""
    f = _get_fernet()
    if f is None:
        return plaintext
    token = f.encrypt(plaintext.encode("utf-8")).decode("utf-8")
    return f"{_ENCRYPTED_PREFIX}{token}"


def decrypt_secret(stored: str) -> str:
    if not stored:
        return ""
    if not stored.startswith(_ENCRYPTED_PREFIX):
        return stored
    f = _get_fernet()
    if f is None:
        return ""
    token = stored[len(_ENCRYPTED_PREFIX):]
    try:
        return f.decrypt(token.encode("utf-8")).decode("utf-8")
    except InvalidToken:
        return ""


def is_encrypted(stored: str) -> bool:
    return bool(stored) and stored.startswith(_ENCRYPTED_PREFIX)
