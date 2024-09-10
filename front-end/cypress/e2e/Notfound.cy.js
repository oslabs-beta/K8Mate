/* global cy, it, describe */

describe('404 Error Page', () => {
    it('should navigate to a non-existing page and display the correct content', () => {
      cy.visit('/non-existing-page');
      
      cy.get('[data-testid="titleName"]')
        .should('exist')
        .and('have.text', 'Super Kuber™');
      
      cy.get('[data-testid="404"]')
        .should('exist')
        .and('have.text', '404 - Page Not Found');
      
      cy.get('[data-testid="sorry"]')
        .should('exist')
        .and('have.text', 'Sorry, the page you are looking for does not exist.');
    });
  });
  