# bldimo

Simulateur d'aide immobilière au Maroc (Daam Sakane + dispositifs étrangers).

Application mobile React Native / Expo destinée au Google Play Store.

## Fonctionnalités

- Simulateur Marocain résidant
- Simulateur MRE
- Simulateur Étranger (résident / investisseur)
- Checklist documents interactive
- Moteur de règles d'éligibilité 100% local et déterministe

## Installation

```bash
npm install
npx expo start
```

## Build Play Store

```bash
npm install -g eas-cli
eas login
eas build -p android --profile production
```

## Stack

- Expo
- React Native
- TypeScript
- Moteur d'éligibilité pur TypeScript (zéro coût API)

## Sources officielles

- https://www.daamsakane.ma
- https://www.cdg.ma
- https://www.mhpv.gov.ma
