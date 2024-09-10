/* global cy, it, beforeEach, describe */

describe('testing Dashboard.tsx', () => {
    beforeEach(() => {
        // Visit the dashboard page
        cy.visit('/dashboard');
    });

    it('the word dashboard should be shown', () => {
        cy.visit('/dashboard')
        cy.get('[data-testid="dashboard"]').should('exist')
        .should('have.text', 'Dashboard')
    })

    it('should have a dropdown menu with different options', () => {
        cy.visit('/dashboard') // Ensure you're on the correct page
        cy.get('#names').should('be.visible').within(() => {
            cy.get('option').should('contain.text', 'All Graphs')
            cy.get('option').should('contain.text', 'Nodes Charts')
            cy.get('option').should('contain.text', 'Cluster Charts')
        })
    })

    it('should display iframes for All Graphs when loadedIframes is set', () => {
        cy.visit('/dashboard');

        cy.get('select').select('default'); 
        cy.get('iframe').should('have.length.greaterThan', 0); 
      });
      it('should display iframes for Node Charts when selected', () => {
        cy.visit('/dashboard');
    
        cy.get('select').select('Node Charts');
        cy.get('iframe').should('have.length.greaterThan', 0);
      });
      it('should display iframes for Cluster Charts when selected', () => {
        cy.visit('/dashboard');
    
        cy.get('select').select('Cluster Charts');
        cy.get('iframe').should('have.length.greaterThan', 0); 
      });
});