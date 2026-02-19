Déploiement GitHub Pages

1) Installer la dépendance (exécuter localement) :

```bash
cd my-app-de-test
npm install --save-dev gh-pages
```

2) Construire et déployer :

```bash
npm run deploy
```

Ce que les scripts font :
- `predeploy`: exécute `npm run build`
- `deploy`: publie le dossier `build` sur la branche `gh-pages` via `gh-pages`

Remarques :
- Assure-toi que le champ `homepage` dans `package.json` est bien :
  `https://wh0amix.github.io/Fil-rouge-TDD`
- Tu peux configurer GitHub Pages pour servir la branche `gh-pages` dans les Settings du dépôt si nécessaire.
