# Script intelligent Al Omrane → bldimo

## Objectif
Importer les projets **habitat** ≤ **700 000 DH**, avec **prix min/max réels** (fiche produit) + surfaces, écrire `src/data/alomrane_projects.json`.

## Installation
```bash
pip install requests beautifulsoup4
```

## Utilisation

### 1) Import liste (rapide)
```bash
python scripts/fetch_alomrane.py --all
```

### 2) Enrichir les prix depuis chaque fiche (recommandé pour la barre Prix)
Sans rescraper toute la liste — utilise le JSON déjà généré (ex. 190 projets) :
```bash
python scripts/fetch_alomrane.py --enrich-only
```

Ou en une passe (plus long) :
```bash
python scripts/fetch_alomrane.py --all --enrich-prices
```

### Test
```bash
python scripts/fetch_alomrane.py --max-pages 2 --enrich-prices
```

## Champs utiles pour les filtres app
- `priceMin` / `priceMax` : fourchette lue sur la fiche
- `surfaceMin` / `surfaceMax` : m² si présents
- Si prix introuvable : `priceMax` reste 700000 (plafond filtre site)

## Après import
```bash
npx expo start --clear
```
