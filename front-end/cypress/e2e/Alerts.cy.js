/* global cy, it, describe */

describe('testing alerts', () => {
    it('should display the search input field', () => {
      cy.visit('/alerts'); // Make sure you're visiting the correct path
  
      // Assert that the search input exists
      cy.get('input[placeholder="Search messages..."]').should('exist');
    });
    it('should display the table headers for new alerts', () => {
        cy.visit('/alerts');
        // Check if the table headers for new alerts exist
        cy.get('table').first().within(() => {
          cy.contains('Component Name').should('exist');
          cy.contains('Message').should('exist');
          cy.contains('Category').should('exist');
          cy.contains('Time Stamp').should('exist');
          cy.contains('Status').should('exist');
        });
    });
    it('should display pagination controls for new alerts', () => {
        cy.visit('/alerts');
        // Check if the pagination controls exist
        cy.contains('button', 'prev').should('exist');
        cy.contains('button', 'next').should('exist');
        cy.contains('Page').should('exist');
      });
      it('should display the search input field', () => {
        cy.visit('/alerts'); // Adjust the route if necessary
    
        // Ensure the input field with the correct placeholder exists
        cy.get('input[placeholder="Search messages..."]').should('exist');
      });

      it('should display the table headers for resolved alerts', () => {
        cy.visit('/alerts');
    

        cy.get('table').last().should('be.visible').within(() => {
          cy.contains('Component Name').should('exist');
          cy.contains('Message').should('exist');
          cy.contains('Category').should('exist');
          cy.contains('Time Stamp').should('exist');
          cy.contains('Status').should('exist');
        });
      });
      it('should display pagination controls for new alerts', () => {
        cy.visit('/alerts');
    
        cy.contains('prev').should('exist');
        cy.contains('next').should('exist');
        cy.contains('Page').should('exist');
      });
});