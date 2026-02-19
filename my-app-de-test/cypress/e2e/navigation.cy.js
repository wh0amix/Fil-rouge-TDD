describe('Navigation E2E - Scénarios Multi-Pages', () => {
  
  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    cy.clearLocalStorage();
  });

  describe('Scénario Nominal', () => {
    it('should navigate through registration flow and display updated user count', () => {
      // 1. Accéder à l'accueil
      cy.visit('/');

      // 2. Vérifier que l'accueil affiche "0 utilisateur(s) inscrit(s)"
      cy.get('[data-cy="user-count"]').should('contain', '0 utilisateur(s) inscrit(s)');

      // 3. Vérifier que la liste est vide
      cy.get('[data-cy="empty-list"]').should('be.visible').and('contain', 'Aucun utilisateur inscrit');

      // 4. Cliquer sur le lien vers le formulaire
      cy.get('[data-cy="link-register"]').click();

      // 5. Vérifier que nous sommes sur la page d'inscription
      cy.url().should('include', '/register');
      cy.get('[data-cy="register-form"]').should('be.visible');

      // 6. Remplir le formulaire avec un utilisateur valide
      cy.get('[data-cy="input-nom"]').type('Dupont');
      cy.get('[data-cy="input-prenom"]').type('Pierre');
      cy.get('[data-cy="input-email"]').type('pierre.dupont@example.com');
      cy.get('[data-cy="input-dateNaissance"]').type('1990-05-15');
      cy.get('[data-cy="input-ville"]').type('Paris');
      cy.get('[data-cy="input-codePostal"]').type('75001');

      // 7. Soumettre le formulaire
      cy.get('[data-cy="submit-btn"]').click();

      // 8. Vérifier le message de succès
      cy.get('[data-cy="success-message"]').should('be.visible').and('contain', 'Enregistrement réussi');

      // 9. Attendre la redirection vers l'accueil (2 secondes configurées dans RegisterPage)
      cy.url({ timeout: 5000 }).should('include', '/');

      // 10. Vérifier le compteur mis à jour
      cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');

      // 11. Vérifier que l'utilisateur apparaît dans la liste
      cy.get('[data-cy="users-list"]').should('be.visible');
      cy.get('[data-cy="user-0"]').should('contain', 'Dupont Pierre');
      cy.get('[data-cy="user-0"]').should('contain', 'pierre.dupont@example.com');
    });
  });

  describe('Scénario d\'Erreur', () => {
    it('should handle invalid form submission and keep user count unchanged', () => {
      // Pré-condition : ajouter un utilisateur via localStorage
      const existingUser = {
        nom: 'Martin',
        prenom: 'Jean',
        email: 'jean.martin@example.com',
        dateNaissance: '1985-03-20',
        ville: 'Lyon',
        codePostal: '69000'
      };
      cy.window().then((win) => {
        win.localStorage.setItem('users', JSON.stringify([existingUser]));
      });

      // 1. Accéder à l'accueil
      cy.visit('/');

      // 2. Vérifier que le compteur affiche "1 utilisateur(s) inscrit(s)"
      cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');

      // 3. Vérifier que l'utilisateur existant est dans la liste
      cy.get('[data-cy="users-list"]').should('be.visible');
      cy.get('[data-cy="user-0"]').should('contain', 'Martin Jean');

      // 4. Naviguer vers le formulaire
      cy.get('[data-cy="link-register"]').click();
      cy.url().should('include', '/register');

      // 5. Remplir le formulaire avec des données invalides (nom vide, email mal formé, âge < 18, etc.)
      // Laisser nom et email vides (déjà vides), remplir les autres partiellement
      cy.get('[data-cy="input-prenom"]').type('Marie');
      cy.get('[data-cy="input-dateNaissance"]').type('2010-01-01'); // Moins de 18 ans
      cy.get('[data-cy="input-ville"]').type('Marseille');
      cy.get('[data-cy="input-codePostal"]').type('13000');

      // 6. Soumettre le formulaire
      cy.get('[data-cy="submit-btn"]').click();

      // 7. Vérifier que les erreurs s'affichent
      cy.get('[data-cy="error-nom"]').should('be.visible').and('contain', 'Le nom');
      cy.get('[data-cy="error-email"]').should('be.visible').and('contain', 'Email');
      cy.get('[data-cy="error-dateNaissance"]').should('be.visible');

      // 8. Vérifier qu'il n'y a pas de redirection (on reste sur /register)
      cy.url().should('include', '/register');

      // 9. Naviguer manuellement vers l'accueil
      cy.get('[data-cy="nav-home"]').click();

      // 10. Vérifier que le compteur n'a pas changé (toujours 1 utilisateur)
      cy.get('[data-cy="user-count"]').should('contain', '1 utilisateur(s) inscrit(s)');

      // 11. Vérifier que la liste n'a pas changé (seul Martin Jean reste)
      cy.get('[data-cy="users-list"]').should('be.visible');
      cy.get('[data-cy="user-0"]').should('contain', 'Martin Jean');
      cy.get('[data-cy="user-1"]').should('not.exist');
    });
  });
});
