#!/usr/bin/env python3
"""
bldimo – Script intelligent d'import Al Omrane
- Projets prix ≤ 700 000 DH, habitat uniquement
- 1 image par projet (product_list ou og:image)
- Sortie : src/data/alomrane_projects.json

Usage :
  pip install requests beautifulsoup4
  python scripts/fetch_alomrane.py --max-pages 2
  python scripts/fetch_alomrane.py --all
  python scripts/fetch_alomrane.py --all --enrich-images
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installez : pip install requests beautifulsoup4")
    sys.exit(1)

BASE = "https://www.alomrane.gov.ma"
LIST_URL = (
    BASE
    + "/Nos-produits/Projets?price%5Bmin%5D=0&price%5Bmax%5D=700000&pagelist={page}"
)
PRICE_MAX = 700_000

EXCLUDE_KEYWORDS = [
    r"\blot(?:s)?\s+de\s+terrain\b",
    r"\blots?\s+de\s+terrains?\b",
    r"\bterrain(?:s)?\s+nu\b",
    r"\blotissement\b.*\bterrain\b",
    r"\blots?\s+R\+\d\b",
    r"\bactivi[tée]s?\s+commercial",
    r"\bcommerce(?:s)?\b",
    r"\bcommercial(?:e|es)?\b",
    r"\blots?\s+d['’]activit",
    r"\busage\s+co(?:mmercial)?\b",
    r"\bRDC\s+commercial\b",
    r"\bà\s+RDC\s+Habitat\b",
]

INCLUDE_KEYWORDS = [
    r"\bappartement",
    r"\br[ée]sidence\b",
    r"\blogement",
    r"\bvilla",
    r"\bmaison",
    r"\bstudio",
    r"\bduplex",
    r"\bimmeuble",
]

EXCLUDE_RE = re.compile("|".join(EXCLUDE_KEYWORDS), re.I)
INCLUDE_RE = re.compile("|".join(INCLUDE_KEYWORDS), re.I)

COLORS = [
    "#005C9E", "#0D9488", "#1E40AF", "#0F766E",
    "#003D6B", "#14B8A6", "#0369A1", "#1E3A5F",
]

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "src" / "data" / "alomrane_projects.json"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "fr-FR,fr;q=0.9",
}


def make_id(url: str) -> str:
    return hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]


def classify_type(title: str, description: str) -> str | None:
    text = f"{title} {description}"
    if EXCLUDE_RE.search(text):
        if not re.search(r"\bappartement|\br[ée]sidence\b|\blogements?\b", text, re.I):
            return None
    if re.search(r"\bvilla", text, re.I):
        return "villa"
    if re.search(r"\bmaison", text, re.I):
        return "maison"
    if INCLUDE_RE.search(text):
        return "appartement"
    if re.search(r"\br[ée]sidence\b", title, re.I) and not EXCLUDE_RE.search(text):
        return "appartement"
    return None


def abs_url(src: str | None) -> str | None:
    if not src:
        return None
    src = src.strip()
    if not src or src.startswith("data:"):
        return None
    return urljoin(BASE, src)


def parse_list_page(html: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    items: list[dict[str, Any]] = []
    seen_urls: set[str] = set()

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if "product_list" not in src and "image_gallery" not in src:
            continue

        node = img
        card = None
        for _ in range(12):
            node = getattr(node, "parent", None)
            if node is None:
                break
            links = node.find_all("a", href=True) if hasattr(node, "find_all") else []
            proj_links = [a for a in links if "/Produits/Projets/" in (a.get("href") or "")]
            hs = node.find_all(["h2", "h3", "h4"]) if hasattr(node, "find_all") else []
            if proj_links and hs:
                card = node
                break
        if not card:
            continue

        title_el = card.find(["h2", "h3", "h4"])
        title = title_el.get_text(strip=True) if title_el else ""

        href = None
        for a in card.find_all("a", href=True):
            h = a.get("href") or ""
            if "/Produits/Projets/" in h:
                href = urljoin(BASE, h)
                break
        if not href or href in seen_urls:
            continue
        seen_urls.add(href)

        description = ""
        if title_el:
            for sib in title_el.next_siblings:
                if getattr(sib, "name", None) in ("a", "h2", "h3", "h4"):
                    break
                if getattr(sib, "get_text", None):
                    t = sib.get_text(" ", strip=True)
                    if t and "plus d" not in t.lower():
                        description = (description + " " + t).strip()

        city = ""
        if title_el:
            scan = title_el
            for _ in range(6):
                scan = scan.find_previous(["p", "div", "span", "strong", "h5", "h6"])
                if not scan:
                    break
                txt = scan.get_text(strip=True)
                if not txt or len(txt) > 45:
                    continue
                if re.search(r"plus d|http|projet|résidence|logement|appartement", txt, re.I):
                    continue
                if re.match(r"^[\d\s.,]+$", txt):
                    continue
                city = txt
                break

        items.append({
            "title": title[:120],
            "city": city[:60] if city else "",
            "description": description[:280],
            "url": href,
            "imageUrl": abs_url(src),
        })

    for a in soup.find_all("a", href=True):
        href = a.get("href") or ""
        if "/Produits/Projets/" not in href:
            continue
        full = urljoin(BASE, href)
        if full in seen_urls:
            continue
        label = (a.get_text() or "").strip().lower()
        if "plus d" not in label and not full.rstrip("/").split("/")[-1]:
            continue
        seen_urls.add(full)
        prev = a.find_previous(["h2", "h3", "h4"])
        title = prev.get_text(strip=True) if prev else full.rstrip("/").split("/")[-1]
        description = ""
        if prev:
            for sib in prev.next_siblings:
                if sib is a or getattr(sib, "name", None) == "a":
                    break
                if getattr(sib, "get_text", None):
                    t = sib.get_text(" ", strip=True)
                    if t and "plus d" not in t.lower():
                        description = (description + " " + t).strip()
        items.append({
            "title": title[:120],
            "city": "",
            "description": description[:280],
            "url": full,
            "imageUrl": None,
        })

    return items


def fetch_og_image(session: requests.Session, page_url: str) -> str | None:
    try:
        r = session.get(page_url, headers=HEADERS, timeout=25)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            return abs_url(og["content"])
        for img in soup.find_all("img"):
            src = img.get("src") or ""
            if "/var/alomrane/storage/" in src and not src.endswith(".svg"):
                if any(x in src for x in ("gallery", "banner", "product", "media")):
                    return abs_url(src)
    except Exception:
        return None
    return None


def fetch_page(session: requests.Session, page: int) -> str:
    url = LIST_URL.format(page=page)
    r = session.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    return r.text


def detect_total_pages(html: str) -> int:
    nums = re.findall(r"pagelist=(\d+)", html)
    if not nums:
        return 1
    return max(int(n) for n in nums)


def load_previous() -> dict[str, Any]:
    if OUT_JSON.exists():
        try:
            return json.loads(OUT_JSON.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def run(max_pages: int | None, delay: float, enrich_images: bool) -> None:
    session = requests.Session()
    print("→ Récupération page 1…")
    html1 = fetch_page(session, 1)
    total = detect_total_pages(html1)
    if max_pages is not None:
        total = min(total, max_pages)
    print(f"→ Pages à parcourir : {total}")

    all_raw: list[dict[str, Any]] = []
    all_raw.extend(parse_list_page(html1))

    for page in range(2, total + 1):
        try:
            time.sleep(delay)
            print(f"→ Page {page}/{total}…")
            html = fetch_page(session, page)
            all_raw.extend(parse_list_page(html))
        except Exception as exc:
            print(f"  ! Erreur page {page}: {exc}")

    print(f"→ {len(all_raw)} entrées brutes")

    projects: list[dict[str, Any]] = []
    skipped = 0
    with_image = 0

    for i, raw in enumerate(all_raw):
        ptype = classify_type(raw.get("title") or "", raw.get("description") or "")
        if ptype is None:
            skipped += 1
            continue

        image_url = raw.get("imageUrl")
        if enrich_images and not image_url and raw.get("url"):
            time.sleep(delay)
            image_url = fetch_og_image(session, raw["url"])
            if image_url:
                print(f"  + og:image {raw.get('title', '')[:40]}")

        if image_url:
            with_image += 1

        projects.append({
            "id": make_id(raw["url"]),
            "title": raw.get("title") or "Projet Al Omrane",
            "city": raw.get("city") or "Maroc",
            "description": raw.get("description")
            or "Projet habitat Al Omrane éligible à l’aide au logement (à vérifier sur la fiche).",
            "type": ptype,
            "priceMax": PRICE_MAX,
            "url": raw["url"],
            "imageUrl": image_url,
            "imageColor": COLORS[i % len(COLORS)],
            "source": "alomrane",
        })

    by_id: dict[str, dict[str, Any]] = {}
    for p in projects:
        by_id[p["id"]] = p
    projects = list(by_id.values())

    prev = load_previous()
    prev_ids = {p["id"] for p in prev.get("projects", []) if "id" in p}
    new_ids = {p["id"] for p in projects}
    added = len(new_ids - prev_ids)
    removed = len(prev_ids - new_ids)

    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "source": BASE + "/Nos-produits/Projets",
        "priceMaxFilter": PRICE_MAX,
        "count": len(projects),
        "stats": {
            "raw": len(all_raw),
            "skippedNonHabitat": skipped,
            "withImage": with_image,
            "addedSinceLastRun": added,
            "removedSinceLastRun": removed,
        },
        "projects": projects,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print("———")
    print(f"✓ Habitat conservés : {len(projects)}")
    print(f"✓ Avec image : {with_image}")
    print(f"✓ Exclus (terrain/commerce/etc.) : {skipped}")
    print(f"✓ Nouveaux : {added} | Supprimés : {removed}")
    print(f"✓ Fichier : {OUT_JSON}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import projets Al Omrane pour bldimo")
    parser.add_argument("--max-pages", type=int, default=None)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--delay", type=float, default=0.7)
    parser.add_argument("--enrich-images", action="store_true",
                        help="Si pas d'image liste, ouvrir la fiche pour og:image")
    args = parser.parse_args()

    max_pages = args.max_pages
    if max_pages is None and not args.all:
        max_pages = 2
        print("Mode test : 2 pages. Utilisez --all pour tout importer.")

    run(max_pages=max_pages if not args.all else None, delay=args.delay, enrich_images=args.enrich_images)


if __name__ == "__main__":
    main()
