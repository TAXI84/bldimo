# Instructions publication Play Store - bldimo

## 1. Prérequis
- Compte Expo (gratuit) : https://expo.dev
- Compte Google Play Console (25$ une fois) : https://play.google.com/console

## 2. Installer EAS CLI
```bash
npm install -g eas-cli
eas login
```

## 3. Configurer le projet
```bash
cd bldimo
npm install
eas build:configure
```

## 4. Générer l'AAB (Android App Bundle)
```bash
eas build -p android --profile production
```

## 5. Télécharger l'AAB
Une fois le build terminé, télécharge le fichier `.aab` depuis le lien Expo.

## 6. Publier sur Play Store
1. Va sur Google Play Console
2. Crée une nouvelle application
3. Remplis les infos (nom : bldimo, description, captures d'écran)
4. Upload l'AAB dans Production ou Test interne
5. Soumets pour review

## Notes importantes
- Prépare 4-8 captures d'écran de l'appli
- Rédige une description courte et longue
- Icône 512x512 et feature graphic 1024x500 recommandés
- Politique de confidentialité (obligatoire)
