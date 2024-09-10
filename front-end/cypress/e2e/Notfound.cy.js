/* global cy, it, describe */

describe('should display a 404 error page if no route found', () => {
    it('should navigate to the Alerts page and display the correct content', () => {
        cy.visit('/*')
        cy.get('[data-testid="titleName"]').should('exist')
        .should('have.text', 'Super Kuber™')
        cy.get('[data-testid="404"]').should('exist')
        .should('have.text', '404 - Page Not Found')
        cy.get('[data-testid="sorry"]').should('Sorry, the page you are looking for does not exist.')
    })
})