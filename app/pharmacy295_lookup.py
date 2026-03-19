from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, Optional
from xml.etree import ElementTree as ET
from zipfile import ZipFile
import json
import os
import re


_EXCEL_CACHE: dict[str, object] = {
    "path": None,
    "mtime_ns": None,
    "data": {},
}

_MAIN_NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
_REL_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
_BARCODE_PATTERN = re.compile(r"\d+")
_URL_PATTERN = re.compile(r"^https?://", re.IGNORECASE)


@dataclass(frozen=True)
class Pharmacy295Row:
    barcode: str
    product_name: str
    category_name: str
    image_urls: tuple[str, ...]
    source_sheets: tuple[str, ...]

    @property
    def category_levels(self) -> tuple[str, str, str]:
        parts = [part.strip() for part in self.category_name.split("||") if part.strip()]
        category_1 = parts[0] if len(parts) > 0 else ""
        category_2 = parts[1] if len(parts) > 1 else ""
        category_3 = parts[2] if len(parts) > 2 else ""
        return category_1, category_2, category_3


def _candidate_paths() -> Iterable[Path]:
    env_paths = [
        os.getenv("PHARMACY295_LOOKUP_XLSX_PATH", "").strip(),
        os.getenv("PHARMACY295_LOOKUP_XLSX_HOST_PATH", "").strip(),
    ]
    defaults = [
        "/app/pharmacy295-photo-url.xlsx",
        "/home/imageuser/imageDataAPI/app/pharmacy295-photo-url.xlsx",
        "/home/imageuser/pharmacy295-photo-url.xlsx",
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


def resolve_pharmacy295_xlsx_path() -> Optional[Path]:
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


def _sheet_targets(archive: ZipFile) -> Dict[str, str]:
    workbook_root = ET.fromstring(archive.read("xl/workbook.xml"))
    relationships_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    relationship_map = {
        rel.attrib.get("Id", ""): rel.attrib.get("Target", "")
        for rel in relationships_root
    }

    targets: Dict[str, str] = {}
    sheets = workbook_root.find(f"{_MAIN_NS}sheets")
    if sheets is None:
        return targets

    for sheet in sheets:
        name = sheet.attrib.get("name", "").strip()
        rel_id = sheet.attrib.get(f"{_REL_NS}id", "").strip()
        target = relationship_map.get(rel_id, "").strip()
        if not name or not target:
            continue
        targets[name] = f"xl/{target}" if not target.startswith("xl/") else target
    return targets


def _append_urls(target: list[str], raw_value: str) -> None:
    raw_value = str(raw_value or "").strip()
    if not raw_value:
        return

    values: list[str]
    if raw_value.startswith("["):
        try:
            parsed = json.loads(raw_value)
        except json.JSONDecodeError:
            parsed = []
        values = [str(item).strip() for item in parsed if isinstance(item, str)]
    else:
        values = [raw_value]

    for value in values:
        if not value or not _URL_PATTERN.match(value):
            continue
        if value not in target:
            target.append(value)


def _sheet_rows(xlsx_path: Path) -> Dict[str, Pharmacy295Row]:
    with ZipFile(xlsx_path) as archive:
        shared_strings = _shared_strings(archive)
        sheet_targets = _sheet_targets(archive)
        workbook_data = {
            sheet_name: ET.fromstring(archive.read(sheet_target))
            for sheet_name, sheet_target in sheet_targets.items()
        }

    rows: Dict[str, dict[str, object]] = {}

    def ensure_row(barcode: str) -> dict[str, object]:
        return rows.setdefault(
            barcode,
            {
                "product_name": "",
                "category_name": "",
                "image_urls": [],
                "source_sheets": [],
            },
        )

    def consume_sheet(
        sheet_name: str,
        header_map: Dict[str, str],
        *,
        barcode_column: str,
        category_column: str,
        product_column: str,
        url_columns: list[str],
    ) -> None:
        sheet_root = workbook_data.get(sheet_name)
        if sheet_root is None:
            return

        sheet_data = sheet_root.find(f"{_MAIN_NS}sheetData")
        if sheet_data is None:
            return

        normalized_headers: Dict[str, str] = {}
        data_started = False

        for row in sheet_data:
            cell_map: Dict[str, str] = {}
            for cell in row:
                ref = cell.attrib.get("r", "")
                column = "".join(ch for ch in ref if ch.isalpha())
                if not column:
                    continue
                cell_map[column] = _cell_value(cell, shared_strings)

            if not data_started:
                normalized_headers = {
                    column: value.strip()
                    for column, value in cell_map.items()
                    if value.strip()
                }
                if all(normalized_headers.get(column, "") == expected for column, expected in header_map.items()):
                    data_started = True
                continue

            barcode = normalize_barcode(cell_map.get(barcode_column, ""))
            if not barcode:
                continue

            target = ensure_row(barcode)
            product_name = str(cell_map.get(product_column, "")).strip()
            category_name = str(cell_map.get(category_column, "")).strip()

            if not target["product_name"] and product_name:
                target["product_name"] = product_name
            if not target["category_name"] and category_name:
                target["category_name"] = category_name

            image_urls = target["image_urls"]
            assert isinstance(image_urls, list)
            for column in url_columns:
                _append_urls(image_urls, cell_map.get(column, ""))

            source_sheets = target["source_sheets"]
            assert isinstance(source_sheets, list)
            if sheet_name not in source_sheets:
                source_sheets.append(sheet_name)

    consume_sheet(
        "Products",
        {
            "A": "Category_name",
            "B": "Product_name",
            "C": "Product_barcode",
            "D": "Product_asset",
        },
        barcode_column="C",
        category_column="A",
        product_column="B",
        url_columns=["D"],
    )
    consume_sheet(
        "Missing Images",
        {
            "A": "Product_barcode",
            "B": "Category_name",
            "C": "Product_name",
            "D": "Photo pack 1",
        },
        barcode_column="A",
        category_column="B",
        product_column="C",
        url_columns=["D", "E"],
    )

    return {
        barcode: Pharmacy295Row(
            barcode=barcode,
            product_name=str(data["product_name"]).strip(),
            category_name=str(data["category_name"]).strip(),
            image_urls=tuple(str(url).strip() for url in data["image_urls"] if str(url).strip()),
            source_sheets=tuple(str(sheet).strip() for sheet in data["source_sheets"] if str(sheet).strip()),
        )
        for barcode, data in rows.items()
    }


def get_pharmacy295_lookup(force_reload: bool = False) -> Dict[str, Pharmacy295Row]:
    xlsx_path = resolve_pharmacy295_xlsx_path()
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


def lookup_pharmacy295_product(barcode: object) -> Optional[Pharmacy295Row]:
    normalized = normalize_barcode(barcode)
    if not normalized:
        return None
    return get_pharmacy295_lookup().get(normalized)
