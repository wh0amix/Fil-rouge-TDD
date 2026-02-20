# Fil Rouge TDD - Application d'Enregistrement

Projet de test-driven development (TDD) avec formulaire d'enregistrement utilisant une API externe et des tests complets.

## Architecture

```
my-app-de-test/
├── src/
│   ├── api/userAPI.js              # Service API avec axios
│   ├── UsersContext.js             # Gestion d'état (Context API)
│   ├── pages/RegisterPage.js       # Formulaire d'enregistrement
│   ├── pages/RegisterPage.test.js  # Tests Jest (15+ cas)
│   └── validators.js               # Validation des champs
├── cypress/
│   └── e2e/navigation.cy.js        # Tests E2E (5 scénarios)
└── package.json
```

## Démarrage rapide

```bash
cd my-app-de-test
npm install
npm start
```

Ouvre http://localhost:3000

## Tests

### Jest (tests d'intégration avec mocks)
```bash
npm test
```

Couvre: succès (200/201), erreurs métier (400), erreurs serveur (500), validation

### Cypress (tests E2E)
```bash
npx cypress open
npx cypress run
```

Couvre: workflows complets, gestion d'erreurs, réessais, validation

## Mocks

Tous les appels API sont mockés dans les tests:
- Jest: `jest.mock('axios')`
- Cypress: `cy.intercept()`

Aucun appel réseau réel ne sort des tests.

## Déploiement

L'application se déploie automatiquement sur GitHub Pages via GitHub Actions à chaque push sur `main`.

## Documentation

Voir `my-app-de-test/README.md` pour les détails techniques.
