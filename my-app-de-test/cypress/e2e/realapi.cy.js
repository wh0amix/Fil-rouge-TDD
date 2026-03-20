describe('E2E - real API', () => {
  it('affiche les utilisateurs depuis la vraie base de donnees', () => {
    cy.visit('/');

    cy.get('[data-cy="user-stats"]').should('be.visible');
    cy.get('[data-cy="user-count"]').should('not.contain', '0 utilisateur(s)');
    cy.get('[data-cy="users-list"]').should('be.visible');
    cy.get('[data-cy="users-list"] li').should('have.length.greaterThan', 0);
  });
});
