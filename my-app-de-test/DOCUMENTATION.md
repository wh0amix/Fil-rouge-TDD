# Documentation - Formulaire d'Enregistrement React
#
## Vue d'ensemble

Ce projet est une application React permettant aux utilisateurs de s'enregistrer via un formulaire avec validation complète. Les données sont sauvegardées dans le localStorage du navigateur.

## Architecture

### Structure des fichiers

```
src/
├── App.js                 # Composant principal du formulaire
├── App.css                # Styles du formulaire
├── App.test.js            # Tests du composant App (unitaires et intégration)
├── validators.js          # Fonctions de validation métier
├── validators.test.js     # Tests des validations (100% couverture)
├── index.js               # Point d'entrée (non testé)
├── reportWebVitals.js     # Performance metrics (non testé)
└── setupTests.js          # Configuration Jest
```

## Fonctionnalités

### 1. Champs du formulaire

- **Nom** : Champ texte obligatoire
- **Prénom** : Champ texte obligatoire
- **Email** : Champ email avec validation de format
- **Date de naissance** : Sélecteur de date avec validation d'âge
- **Ville** : Champ texte obligatoire
- **Code postal** : Champ texte français (5 chiffres)

### 2. Validations

#### validateEmail(email)
- Valide le format email
- Utilise une regex pour vérifier la présence de `@` et d'un domaine
- Retourne `true` si valide, `false` sinon

#### validateCodePostal(code)
- Valide le format postal français (5 chiffres)
- Utilise la regex `/^\d{5}$/`
- Retourne `true` si valide, `false` sinon

#### validateAge(dateString)
- Vérifie que l'utilisateur a au moins 18 ans
- Traite les cas limites (anniversaire aujourd'hui)
- Retourne `true` si ≥18 ans, `false` sinon

#### validateNom(nom)
- Vérifie que le nom n'est pas vide
- Ignore les espaces blancs
- Retourne `true` si valide, `false` sinon

#### validatePrenom(prenom)
- Vérifie que le prénom n'est pas vide
- Ignore les espaces blancs
- Retourne `true` si valide, `false` sinon

#### validateVille(ville)
- Vérifie que la ville n'est pas vide
- Ignore les espaces blancs
- Retourne `true` si valide, `false` sinon

#### validateFormData(formData)
- Fonction orchestratrice qui valide tous les champs
- Retourne un objet avec les erreurs trouvées
- Objet vide si le formulaire est valide

### 3. Stockage des données

Les données sont sauvegardées dans le localStorage sous la clé `'users'`. Format:

```javascript
[
  {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean@example.com",
    dateNaissance: "2003-05-15",
    ville: "Paris",
    codePostal: "75001"
  },
  // ... autres utilisateurs
]
```

### 4. Interface utilisateur

- Affichage des messages d'erreur en rouge sous chaque champ
- Message de confirmation "Enregistrement réussi!" en vert
- Le message de confirmation disparaît après 3 secondes
- Le formulaire est réinitialisé après un enregistrement réussi

## Tests

### Couverture de test

**Validateurs (validators.test.js)**: 100% de couverture - 32 tests

- **validateEmail**: 3 tests (valides, invalides, non-string)
- **validateCodePostal**: 3 tests (valides, invalides, non-string)
- **validateAge**: 7 tests (>=18, <18, date future, invalide, non-string, cas limites)
- **validateNom**: 4 tests (valide, chiffres rejetés, vide, non-string)
- **validatePrenom**: 4 tests (valide, chiffres rejetés, vide, non-string)
- **validateVille**: 3 tests (valide, vide, non-string)
- **validateFormData**: 8 tests (données valides, tous les champs invalides, erreurs multiples)

**Composant App (App.test.js)**: 22 tests

#### Rendering (2 tests)
- Rendu de tous les éléments du formulaire
- Champs initialement vides

#### Form Input Handling (3 tests)
- Mise à jour des champs
- Suppression des messages d'erreur lors de la saisie
- Gestion de plusieurs champs

#### Form Validation (9 tests)
- Erreur pour nom vide/avec chiffres
- Erreur pour prénom vide/avec chiffres
- Erreur pour email invalide
- Erreur pour date manquante
- Erreur pour âge <18
- Erreur pour ville vide
- Erreur pour code postal invalide

#### Form Submission (6 tests)
- Non-soumission avec erreurs
- Sauvegarde en localStorage
- Réinitialisation du formulaire
- Message de succès
- Ajout de plusieurs utilisateurs
- Affichage du message de succès

#### Integration Tests (2 tests)
- Flux complet d'enregistrement
- Validation de tous les champs à la fois (formulaire vide)

**Fichier ancien (validator.test.js)**: 28 tests (pas testé dans la couverture finale)

**Total: 32 tests validateurs + 22 tests App = 54 tests (+ 28 tests ancien = 82 tests au total)**

### Exécution des tests

```bash
cd my-app-de-test
npm test
```

Pour voir la couverture:

```bash
npm test -- --coverage --watchAll=false
```

### Fiabilité des tests

1. **Isolation**: Chaque test réinitialise le localStorage et les mocks
2. **Determinisme**: Utilisation de dates calculées (pas de valeurs figées)
3. **Cas limites**: Tests des anniversaires et des cas extrêmes
4. **Type safety**: Tests avec types invalides (null, undefined, objets)
5. **Tests d'intégration**: Vérification du flux complet utilisateur

## Installation et utilisation

### Installation des dépendances

```bash
cd my-app-de-test
npm install
```

### Lancer l'application

```bash
npm start
```

L'application s'ouvre sur http://localhost:3000

### Lancer les tests

```bash
npm test
```

## Cas d'utilisation

### Scénario 1: Enregistrement réussi
1. Utilisateur remplit tous les champs correctement
2. Clique sur "S'enregistrer"
3. Message de confirmation apparaît
4. Formulaire se réinitialise
5. Données sauvegardées en localStorage

### Scénario 2: Validation échouée
1. Utilisateur remplit partiellement le formulaire
2. Clique sur "S'enregistrer"
3. Messages d'erreur apparaissent
4. Utilisateur corrige les erreurs
5. Messages d'erreur disparaissent au fur et à mesure
6. Enregistrement réussi

### Scénario 3: Blocage des mineurs
1. Utilisateur entre une date de naissance indiquant <18 ans
2. Clique sur "S'enregistrer"
3. Message d'erreur "Vous devez avoir au moins 18 ans" apparaît
4. Formulaire ne se soumet pas
5. Aucune donnée n'est sauvegardée

## Types de données

### FormData
```typescript
{
  nom: string,
  prenom: string,
  email: string,
  dateNaissance: string (format YYYY-MM-DD),
  ville: string,
  codePostal: string (5 chiffres)
}
```

### Errors
```typescript
{
  [fieldName]: string (message d'erreur)
  // Objet vide si pas d'erreur
}
```

## Responsabilités

### validators.js
- Valide les données
- Aucune dépendance React
- Exportable et testable indépendamment
- Retourne toujours un booléen ou un objet d'erreurs

### App.js
- Gère l'état du formulaire
- Affiche l'interface
- Appelle les validations
- Gère le localStorage
- Affiche les messages

## Notes de développement


### Choix technologiques

1. **useState**: Gestion d'état simple pour un formulaire
2. **localStorage**: Persistance locale sans base de données
3. **Regex**: Validation simple et performante
4. **React Testing Library**: Test du comportement utilisateur, pas des détails d'implémentation
