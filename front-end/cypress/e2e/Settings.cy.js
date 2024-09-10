/* global cy, it, beforeEach, describe */

describe('testing settings.tsx', () => {
    beforeEach(() => {
        cy.visit('/settings')
    })

    it('should render the form with correct fields and buttons', () => {
        cy.get('form').should('exist');
        cy.contains('Settings').should('exist');
        cy.contains('Dark Mode').should('exist');
        cy.contains('Timezone').should('exist');
        cy.get('button[type="submit"]').should('exist').and('have.text', 'Save changes');
    })

    it('should select a timezone', () => {
        cy.get('select[name="timezone"]').should('exist');
        cy.get('select[name="timezone"]').select('America/New_York');
        cy.get('select[name="timezone"]').should('have.value', 'America/New_York');
      });

    it('should render the timezone select with correct options', () => {
    cy.get('select[aria-label="Timezone"]')
        .should('exist')                        
        .should('have.attr', 'name', 'timezone');  
    })

    it('should render a button with the correct type and text', () => {
    cy.get('[data-testid="submit"]')
        .should('exist')   
        .should('have.attr', 'type', 'submit')
        .should('have.text', 'Save changes')
        .should('match', 'button'); 
    });
})