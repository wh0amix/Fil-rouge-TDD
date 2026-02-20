describe('Navigation E2E - Scénarios Multi-Pages', () => {

  beforeEach(() => {
    // Mocker les appels GET /users (liste vide initialement)
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: []
    }).as('getUsers');
  });

  describe('Scénario Nominal - API Success (200/201)', () => {
    it('should navigate through registration flow with successful API call', () => {
      // Mocker le POST pour créer un utilisateur
      cy.intercept('POST', '**/users', {
        statusCode: 201,
        body: {
          id: 1,
          name: 'Dupont Pierre',
          email: 'pierre.dupont@example.com',
          phone: '75001',
          username: 'dupont'
        }
      }).as('createUser');

      // 1. Accéder à l'accueil
      cy.visit('/');
      cy.wait('@getUsers');

      // 2. Vérifier que l'accueil affiche "0 utilisateur(s) inscrit(s)"
      cy.get('[data-cy="user-count"]').should('contain', '0 utilisateur(s) inscrit(s)');

      // 3. Vérifier que la liste est vide
      cy.get('[data-cy="empty-list"]').should('be.visible').and('contain', 'Aucun utilisateur inscrit');

      // 4. Naviguer vers le formulaire
      cy.get('[data-cy="link-register"]').click();
      cy.url().should('include', '/register');
      cy.get('[data-cy="register-form"]').should('be.visible');

      // 5. Remplir le formulaire
      cy.get('[data-cy="input-nom"]').type('Dupont');
      cy.get('[data-cy="input-prenom"]').type('Pierre');
      cy.get('[data-cy="input-email"]').type('pierre.dupont@example.com');
      cy.get('[data-cy="input-dateNaissance"]').type('1990-05-15');
      cy.get('[data-cy="input-ville"]').type('Paris');
      cy.get('[data-cy="input-codePostal"]').type('75001');

      // 6. Soumettre le formulaire
      cy.get('[data-cy="submit-btn"]').click();

      // 7. Attendre l'appel POST
      cy.wait('@createUser');

      // 8. Vérifier le message de succès
      cy.get('[data-cy="success-message"]').should('be.visible').and('contain', 'Enregistrement réussi');

      // 9. Attendre la redirection vers l'accueil
      cy.url({ timeout: 5000 }).should('not.include', '/register');

      // 10. Vérifier que le compteur est mis à jour (état local mis à jour par addUser)
      cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');

      // 11. Vérifier que l'utilisateur apparaît dans la liste
      cy.get('[data-cy="users-list"]').should('be.visible');
      cy.get('[data-cy="user-0"]').should('contain', 'Dupont Pierre');
    });
  });

  describe('Scénario Erreur Métier - Business Logic (400)', () => {
    it('should handle email already exists error (400)', () => {
      // Mocker le POST pour retourner une erreur 400
      cy.intercept('POST', '**/users', {
        statusCode: 400,
        body: { message: 'Email already exists' }
      }).as('createUserError');

      cy.visit('/');
      cy.wait('@getUsers');

      cy.get('[data-cy="link-register"]').click();
      cy.url().should('include', '/register');

      // Remplir le formulaire
      cy.get('[data-cy="input-nom"]').type('Dupont');
      cy.get('[data-cy="input-prenom"]').type('Jean');
      cy.get('[data-cy="input-email"]').type('existing@example.com');
      cy.get('[data-cy="input-dateNaissance"]').type('1990-05-15');
      cy.get('[data-cy="input-ville"]').type('Paris');
      cy.get('[data-cy="input-codePostal"]').type('75001');

      // Soumettre
      cy.get('[data-cy="submit-btn"]').click();
      cy.wait('@createUserError');

      // Vérifier l'affichage de l'erreur
      cy.get('[data-cy="api-error"]').should('be.visible').and('contain', 'Email already exists');

      // Vérifier que le formulaire n'a pas été vidé
      cy.get('[data-cy="input-nom"]').should('have.value', 'Dupont');
      cy.get('[data-cy="input-email"]').should('have.value', 'existing@example.com');

      // Vérifier qu'on n'est pas redirigé
      cy.url().should('include', '/register');
    });
  });

  describe('Scénario Erreur Serveur - Server Error (500)', () => {
    it('should handle server error gracefully without crashing', () => {
      // Mocker le POST pour retourner une erreur 500
      cy.intercept('POST', '**/users', {
        statusCode: 500,
        body: { message: 'Internal Server Error' }
      }).as('createUserServerError');

      cy.visit('/');
      cy.wait('@getUsers');

      cy.get('[data-cy="link-register"]').click();
      cy.url().should('include', '/register');

      // Remplir le formulaire
      cy.get('[data-cy="input-nom"]').type('Test');
      cy.get('[data-cy="input-prenom"]').type('User');
      cy.get('[data-cy="input-email"]').type('test@example.com');
      cy.get('[data-cy="input-dateNaissance"]').type('1990-05-15');
      cy.get('[data-cy="input-ville"]').type('Paris');
      cy.get('[data-cy="input-codePostal"]').type('75001');

      // Soumettre
      cy.get('[data-cy="submit-btn"]').click();
      cy.wait('@createUserServerError');

      // Vérifier l'affichage de l'erreur
      cy.get('[data-cy="api-error"]').should('be.visible').and('contain', 'Internal Server Error');

      // Vérifier que l'app ne s'est pas plantée
      cy.get('[data-cy="submit-btn"]').should('be.visible');

      // Vérifier que les données sont conservées
      cy.get('[data-cy="input-nom"]').should('have.value', 'Test');
    });

    it('should allow retry after server error', () => {
      // Compteur pour différencier le 1er et 2ème appel POST
      let callCount = 0;

      cy.intercept('POST', '**/users', (req) => {
        callCount++;
        if (callCount === 1) {
          req.reply({
            statusCode: 500,
            body: { message: 'Server Error' }
          });
        } else {
          req.reply({
            statusCode: 201,
            body: {
              id: 1,
              name: 'Retry User',
              email: 'retry@example.com'
            }
          });
        }
      }).as('createUserRetry');

      cy.visit('/');
      cy.wait('@getUsers');

      cy.get('[data-cy="link-register"]').click();

      cy.get('[data-cy="input-nom"]').type('Retry');
      cy.get('[data-cy="input-prenom"]').type('User');
      cy.get('[data-cy="input-email"]').type('retry@example.com');
      cy.get('[data-cy="input-dateNaissance"]').type('1990-05-15');
      cy.get('[data-cy="input-ville"]').type('Paris');
      cy.get('[data-cy="input-codePostal"]').type('75001');

      // Premier essai - erreur 500
      cy.get('[data-cy="submit-btn"]').click();
      cy.wait('@createUserRetry');
      cy.get('[data-cy="api-error"]').should('be.visible').and('contain', 'Server Error');

      // Deuxième essai - succès
      cy.get('[data-cy="submit-btn"]').click();
      cy.wait('@createUserRetry');
      cy.get('[data-cy="success-message"]').should('be.visible');
    });
  });

  describe('Scénario Validation - Frontend Validation', () => {
    it('should show validation errors and not call API', () => {
      cy.visit('/');
      cy.wait('@getUsers');

      cy.get('[data-cy="link-register"]').click();
      cy.url().should('include', '/register');

      // Soumettre sans remplir (erreur de validation)
      cy.get('[data-cy="submit-btn"]').click();

      // Vérifier les erreurs de validation
      cy.get('[data-cy="error-nom"]').should('be.visible');
      cy.get('[data-cy="error-email"]').should('be.visible');

      // Vérifier qu'aucune erreur API n'est affichée
      cy.get('[data-cy="api-error"]').should('not.exist');
    });
  });
});
