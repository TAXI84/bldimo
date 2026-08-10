# Script intelligent Al Omrane → bldimo

## Objectif
Importer les projets **habitat** ≤ **700 000 DH** depuis alomrane.gov.ma, exclure terrains/commerces, mettre à jour `src/data/alomrane_projects.json`.

## Installation
```bash
pip install requests beautifulsoup4
```

## Utilisation
```bash
# Test (2 pages)
python scripts/fetch_alomrane.py

# 5 pages
python scripts/fetch_alomrane.py --max-pages 5

# Import complet (~48 pages)
python scripts/fetch_alomrane.py --all
```

## Résultat
Fichier : `src/data/alomrane_projects.json`

L’app lit ce fichier via `getProjects()` ; si absent, elle utilise les exemples.

## Fréquence recommandée
Tous les 3 jours (cron ou GitHub Actions).
