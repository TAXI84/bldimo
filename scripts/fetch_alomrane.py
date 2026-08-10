#!/usr/bin/env python3
"""
bldimo – Script intelligent d'import Al Omrane
------------------------------------------------
Objectif :
  - Récupérer les projets Al Omrane (prix ≤ 700 000 DH)
  - Garder uniquement l'habitat (appartement / maison / villa)
  - Exclure terrains et commerces
  - Produire src/data/alomrane_projects.json pour l'app
  - Comparer avec l'ancien fichier : ajouter les nouveaux, retirer les absents

Usage :
  pip install requests beautifulsoup4
  python scripts/fetch_alomrane.py

Option :
  python scripts/fetch_alomrane.py --max-pages 3
  python scripts/fetch_alomrane.py --all
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
    print("Installez les dépendances : pip install requests beautifulsoup4")
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
        "Mozilla/5.0 (compatible; bldimo-bot/1.0; +https://github.com/TAXI84/bldimo)"
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


def parse_list_page(html: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    items: list[dict[str, Any]] = []

    for a in soup.find_all("a", href=True):
        href = a["href"]
        label = (a.get_text() or "").strip().lower()
        if "/Produits/Projets/" not in href:
            continue
        if "plus d" not in label and "Produits/Projets" not in href:
            # keep project detail links even without label
            if not href.rstrip("/").split("/")[-1]:
                continue

        url = urljoin(BASE, href)
        title = ""
        description = ""
        city = ""

        prev = a.find_previous(["h2", "h3", "h4"])
        if prev:
            title = prev.get_text(strip=True)
            for sib in prev.next_siblings:
                if sib is a or (getattr(sib, "name", None) == "a"):
                    break
                if getattr(sib, "get_text", None):
                    t = sib.get_text(" ", strip=True)
                    if t and t.lower() not in ("plus d'infos", "plus d’infos"):
                        description = (description + " " + t).strip()

            node = prev
            for _ in range(8):
                cand = node.find_previous(["p", "div", "span", "strong"])
                if not cand:
                    break
                txt = cand.get_text(strip=True)
                if txt and len(txt) < 40 and not txt.lower().startswith("plus"):
                    if not re.search(r"http|projet|résidence|logement", txt, re.I):
                        city = txt
                        break
                node = cand

        if not title:
            title = url.rstrip("/").split("/")[-1].replace("-", " ").title()

        items.append({
            "title": title[:120],
            "city": city[:60] if city else "",
            "description": description[:280],
            "url": url,
        })

    seen: set[str] = set()
    unique: list[dict[str, Any]] = []
    for it in items:
        if it["url"] in seen:
            continue
        seen.add(it["url"])
        unique.append(it)
    return unique


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


def run(max_pages: int | None, delay: float) -> None:
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
    for i, raw in enumerate(all_raw):
        ptype = classify_type(raw["title"], raw["description"])
        if ptype is None:
            skipped += 1
            continue
        projects.append({
            "id": make_id(raw["url"]),
            "title": raw["title"] or "Projet Al Omrane",
            "city": raw["city"] or "Maroc",
            "description": raw["description"]
            or "Projet habitat Al Omrane éligible à l’aide au logement (à vérifier sur la fiche).",
            "type": ptype,
            "priceMax": PRICE_MAX,
            "url": raw["url"],
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
            "addedSinceLastRun": added,
            "removedSinceLastRun": removed,
        },
        "projects": projects,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    print("———")
    print(f"✓ Habitat conservés : {len(projects)}")
    print(f"✓ Exclus (terrain/commerce/etc.) : {skipped}")
    print(f"✓ Nouveaux : {added} | Supprimés : {removed}")
    print(f"✓ Fichier : {OUT_JSON}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import projets Al Omrane pour bldimo")
    parser.add_argument("--max-pages", type=int, default=None)
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--delay", type=float, default=0.8)
    args = parser.parse_args()

    max_pages = args.max_pages
    if max_pages is None and not args.all:
        max_pages = 2
        print("Mode test : 2 pages. Utilisez --all pour tout importer.")

    run(max_pages=max_pages if not args.all else None, delay=args.delay)


if __name__ == "__main__":
    main()
