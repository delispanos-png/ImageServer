from __future__ import annotations

import re
from html import escape
from html.parser import HTMLParser
from typing import Dict, List, Optional


ALLOWED_TAGS = {
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "a",
}

ALLOWED_ATTRS = {
    "a": {"href", "target", "rel"},
}

BLOCK_TAGS = {"p", "ul", "ol", "li", "h2", "h3", "h4", "blockquote"}
HEADING_KEYWORDS = {
    "περιγραφή",
    "οφέλη",
    "χρήση",
    "χαρακτηριστικά",
    "σύνθεση",
    "συστατικά",
    "δοσολογία",
    "προειδοποιήσεις",
    "προφυλάξεις",
    "τρόπος χρήσης",
    "οδηγίες χρήσης",
    "benefits",
    "usage",
    "directions",
    "description",
    "ingredients",
}


class _HtmlSanitizer(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: List[str] = []
        self.open_tags: List[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        if tag not in ALLOWED_TAGS:
            return

        attr_chunks: List[str] = []
        allowed_attrs = ALLOWED_ATTRS.get(tag, set())
        attr_map: Dict[str, str] = {}
        for key, value in attrs:
            key = key.lower()
            if key in allowed_attrs and value is not None:
                attr_map[key] = value.strip()

        if tag == "a":
            href = attr_map.get("href", "")
            if not href.startswith(("http://", "https://", "/", "#", "mailto:")):
                attr_map.pop("href", None)
            if "target" in attr_map and attr_map["target"] != "_blank":
                attr_map.pop("target", None)
            if attr_map.get("target") == "_blank":
                attr_map["rel"] = "noopener noreferrer"

        for key in sorted(attr_map):
            attr_chunks.append(f' {key}="{escape(attr_map[key], quote=True)}"')

        if tag == "br":
            self.parts.append("<br />")
            return

        self.parts.append(f"<{tag}{''.join(attr_chunks)}>")
        self.open_tags.append(tag)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag not in ALLOWED_TAGS or tag == "br":
            return
        if tag in self.open_tags:
            while self.open_tags:
                open_tag = self.open_tags.pop()
                self.parts.append(f"</{open_tag}>")
                if open_tag == tag:
                    break

    def handle_data(self, data: str) -> None:
        if data:
            self.parts.append(escape(data))

    def handle_entityref(self, name: str) -> None:
        self.parts.append(f"&{name};")

    def handle_charref(self, name: str) -> None:
        self.parts.append(f"&#{name};")

    def close(self) -> str:
        super().close()
        while self.open_tags:
            self.parts.append(f"</{self.open_tags.pop()}>")
        return "".join(self.parts)


class _PlainTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: List[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        if tag.lower() == "br":
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if data:
            self.parts.append(data)


def sanitize_html(value: Optional[str]) -> str:
    if not value or not value.strip():
        return ""
    parser = _HtmlSanitizer()
    parser.feed(value.strip())
    return parser.close().strip()


def html_to_plain_text(value: Optional[str]) -> str:
    if not value or not value.strip():
        return ""
    parser = _PlainTextExtractor()
    parser.feed(value)
    lines = [" ".join(line.split()) for line in "".join(parser.parts).splitlines()]
    return "\n".join(line for line in lines if line).strip()


def plain_text_to_html(value: Optional[str]) -> str:
    text = (value or "").strip()
    if not text:
        return ""
    normalized = text.replace("\r\n", "\n").replace("\r", "\n")
    blocks = [segment.strip() for segment in re.split(r"\n\s*\n", normalized) if segment.strip()]
    html_parts: List[str] = []

    def flush_paragraph(lines: List[str]) -> None:
        if not lines:
            return
        paragraph = " ".join(line.strip() for line in lines if line.strip())
        if paragraph:
            html_parts.append(f"<p>{escape(paragraph)}</p>")

    def flush_list(lines: List[str]) -> None:
        if not lines:
            return
        items = []
        for line in lines:
            item = re.sub(r"^\s*[-*•]+\s*", "", line).strip()
            if item:
                items.append(f"<li>{escape(item)}</li>")
        if items:
            html_parts.append(f"<ul>{''.join(items)}</ul>")

    def looks_like_heading(line: str) -> bool:
        cleaned = re.sub(r"[:：]\s*$", "", line).strip()
        if not cleaned:
            return False
        lower = cleaned.lower()
        if lower in HEADING_KEYWORDS:
            return True
        if len(cleaned) <= 48 and line.strip().endswith(":"):
            return True
        if len(cleaned) <= 42 and re.fullmatch(r"[A-Za-zΑ-Ωα-ω0-9\s/&+-]+", cleaned):
            letters = [char for char in cleaned if char.isalpha()]
            if letters:
                uppercase_ratio = sum(1 for char in letters if char.isupper()) / len(letters)
                if uppercase_ratio >= 0.7:
                    return True
        return False

    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        paragraph_buffer: List[str] = []
        list_buffer: List[str] = []

        for line in lines:
            bullet_line = bool(re.match(r"^\s*[-*•]+\s+", line))
            if bullet_line:
                flush_paragraph(paragraph_buffer)
                paragraph_buffer = []
                list_buffer.append(line)
                continue

            if list_buffer:
                flush_list(list_buffer)
                list_buffer = []

            if looks_like_heading(line):
                flush_paragraph(paragraph_buffer)
                paragraph_buffer = []
                heading = re.sub(r"[:：]\s*$", "", line).strip()
                html_parts.append(f"<h3>{escape(heading)}</h3>")
                continue

            paragraph_buffer.append(line)

        flush_list(list_buffer)
        flush_paragraph(paragraph_buffer)

    return "\n".join(html_parts)
