/* global cy, it, beforeEach, describe */


describe('Terminal Component Test', () => {
    beforeEach(() => {
      cy.visit('/terminal');
    });
  
    it('should render the terminal with the correct heading', () => {
      cy.get('[data-testid="terminal"]').should('exist').and('have.text', 'Terminal');
    });
  });