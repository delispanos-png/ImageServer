from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Optional
from xml.etree import ElementTree as ET
from zipfile import ZipFile
import os
import re


_EXCEL_CACHE: dict[str, object] = {
    "path": None,
    "mtime_ns": None,
    "data": {},
}

_MAIN_NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
_BARCODE_PATTERN = re.compile(r"\d+")


@dataclass(frozen=True)
class CategoryRow:
    barcode: str
    category_1: str
    category_2: str
    category_3: str


def _candidate_paths() -> Iterable[Path]:
    env_paths = [
        os.getenv("CATEGORY_LOOKUP_XLSX_PATH", "").strip(),
        os.getenv("CATEGORY_LOOKUP_XLSX_HOST_PATH", "").strip(),
    ]
    defaults = [
        "/app/295_categories.xlsx",
        "/home/imageuser/295_categories.xlsx",
    ]
    seen = set()
    for raw in env_paths + defaults:
        if not raw:
            continue
        path = Path(raw)
        key = str(path)
        if key in seen:
            continue
        seen.add(key)
        yield path


def resolve_category_xlsx_path() -> Optional[Path]:
    for path in _candidate_paths():
        if path.exists() and path.is_file():
            return path
    return None


def normalize_barcode(value: object) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    if text.endswith(".0") and text.replace(".", "", 1).isdigit():
        text = text[:-2]
    digits = "".join(_BARCODE_PATTERN.findall(text))
    return digits or text


def _shared_strings(archive: ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in archive.namelist():
        return []
    root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    values = []
    for si in root:
        values.append("".join(node.text or "" for node in si.iter(f"{_MAIN_NS}t")))
    return values


def _cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    inline = cell.find(f"{_MAIN_NS}is")
    if inline is not None:
        return "".join(node.text or "" for node in inline.iter(f"{_MAIN_NS}t")).strip()

    value_node = cell.find(f"{_MAIN_NS}v")
    if value_node is None or value_node.text is None:
        return ""

    value = value_node.text.strip()
    if cell.attrib.get("t") == "s" and value:
        return shared_strings[int(value)].strip()
    return value


def _sheet_rows(xlsx_path: Path) -> Dict[str, CategoryRow]:
    with ZipFile(xlsx_path) as archive:
        shared_strings = _shared_strings(archive)
        sheet_root = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))

    sheet_data = sheet_root.find(f"{_MAIN_NS}sheetData")
    if sheet_data is None:
        return {}

    rows: Dict[str, CategoryRow] = {}
    data_started = False

    for row in sheet_data:
        cell_map: Dict[str, str] = {}
        for cell in row:
            ref = cell.attrib.get("r", "")
            column = "".join(ch for ch in ref if ch.isalpha())
            if not column:
                continue
            cell_map[column] = _cell_value(cell, shared_strings)

        code_header = cell_map.get("B", "").strip().upper()
        cat1_header = cell_map.get("C", "").strip().upper()
        if code_header == "CODE" and cat1_header == "CAT_1":
            data_started = True
            continue

        if not data_started:
            continue

        barcode = normalize_barcode(cell_map.get("B", ""))
        if not barcode:
            continue

        rows[barcode] = CategoryRow(
            barcode=barcode,
            category_1=cell_map.get("C", "").strip(),
            category_2=cell_map.get("D", "").strip(),
            category_3=cell_map.get("E", "").strip(),
        )

    return rows


def get_category_lookup(force_reload: bool = False) -> Dict[str, CategoryRow]:
    xlsx_path = resolve_category_xlsx_path()
    if xlsx_path is None:
        return {}

    mtime_ns = xlsx_path.stat().st_mtime_ns
    if (
        not force_reload
        and _EXCEL_CACHE["path"] == str(xlsx_path)
        and _EXCEL_CACHE["mtime_ns"] == mtime_ns
    ):
        return _EXCEL_CACHE["data"]  # type: ignore[return-value]

    data = _sheet_rows(xlsx_path)
    _EXCEL_CACHE["path"] = str(xlsx_path)
    _EXCEL_CACHE["mtime_ns"] = mtime_ns
    _EXCEL_CACHE["data"] = data
    return data


def lookup_categories(barcode: object) -> Optional[CategoryRow]:
    normalized = normalize_barcode(barcode)
    if not normalized:
        return None
    return get_category_lookup().get(normalized)


def apply_excel_categories(product: Dict[str, object]) -> Dict[str, object]:
    barcode = normalize_barcode(product.get("Barcode", ""))
    if not barcode:
        return product

    category_row = lookup_categories(barcode)
    if category_row is None:
        return product

    product["Barcode"] = barcode
    product["Category_1"] = category_row.category_1
    product["Category_2"] = category_row.category_2
    product["Category_3"] = category_row.category_3
    return product
