# Script intelligent Al Omrane → bldimo

## Objectif
Importer les projets **habitat** ≤ **700 000 DH** avec **1 image** par projet, exclure terrains/commerces, écrire `src/data/alomrane_projects.json`.

## Installation
```bash
pip install requests beautifulsoup4
```

## Utilisation
```bash
python scripts/fetch_alomrane.py --max-pages 2
python scripts/fetch_alomrane.py --all
python scripts/fetch_alomrane.py --all --enrich-images
```

## Images
- Priorité : vignette `product_list` de la liste Projets
- Secours (`--enrich-images`) : `og:image` de la fiche

## Après import
```bash
npx expo start --clear
```
