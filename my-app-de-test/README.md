# Application d'Enregistrement avec API

[![npm version](https://img.shields.io/npm/v/my-app-de-test.svg)](https://www.npmjs.com/package/my-app-de-test)

Formulaire d'enregistrement utilisant JSONPlaceholder comme API externe. Tests complètement isolés via mocks Jest et Cypress.

## Package npm

[https://www.npmjs.com/package/my-app-de-test](https://www.npmjs.com/package/my-app-de-test)

### Utilisation de la librairie

```bash
npm install my-app-de-test
```

```javascript
import { RegisterPage, validateEmail, validateFormData } from 'my-app-de-test';
```


## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Ouvre http://localhost:3000

## Tests

### Jest (tests d'intégration)
```bash
npm test
```

Cas couverts:
- Succès (200/201): Données valides, message de succès, formulaire vidé
- Erreur métier (400): Email existe, données invalides
- Erreur serveur (500): Crash serveur, comportement graceful, réessai
- Validation: Pas d'appel API si validation échoue

### Cypress (tests E2E)
```bash
npx cypress open    # Mode interactif
npx cypress run     # Mode headless
```

Cas couverts:
- Workflow complet avec succès
- Erreur 400 avec message spécifique
- Erreur 500 sans crash
- Réessai après erreur
- Validation locale

## Architecture

Les appels axios sont mockés dans les tests pour isoler l'application du serveur.

Jest mock:
```javascript
jest.mock('axios');
axios.post.mockResolvedValueOnce({ data: { id: 1 } });
axios.post.mockRejectedValueOnce(new Error('Email exists'));
```

Cypress intercept:
```javascript
cy.intercept('POST', '**/users', { statusCode: 201, body: {...} });
```


## Fichiers clés

- `src/api/userAPI.js` - Service API axios
- `src/UsersContext.js` - Gestion d'état avec appels API
- `src/pages/RegisterPage.js` - Formulaire avec gestion async
- `src/pages/RegisterPage.test.js` - Tests Jest (15+ cas)
- `cypress/e2e/navigation.cy.js` - Tests Cypress (5 scénarios)

## Production

Pour utiliser une API réelle:
```javascript
// src/api/userAPI.js
const API_URL = 'https://votre-api.com/users';
```

Les tests continueront à fonctionner avec les mocks.
