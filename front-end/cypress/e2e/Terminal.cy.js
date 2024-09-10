/* global cy, it, beforeEach, describe */


describe('Terminal Component Tests', () => {
  beforeEach(() => {
    cy.visit('/terminal');
  });
  it('should load the page and display the body', () => {
    cy.get('body').should('exist'); // Check if the page body is loaded
  });
})