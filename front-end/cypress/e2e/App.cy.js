/* global cy, it, describe */

describe('testing App.tsx', () => {
  it('should navigate to Home page and display the correct content', () => {
    cy.visit('/') // Visit the home route
    cy.get('[data-testid="slogan"]').should('exist')
  })

  it('should display all features on the Home Page', () => {
    cy.visit('/')
    cy.contains('Reports').should('exist')
    cy.contains('Alerts').should('exist')
    cy.contains('K8 Structure').should('exist')
  })

  it('should navigate to the Dashboard page and display the correct content', () => {
    cy.visit('/dashboard') // Visit the dashboard route
  })

  it('should navigate to the Alerts page and display the correct content', () => {
    cy.visit('/alerts') // Visit the alerts route
  })

  it('should navigate to the Tree page and display the correct content', () => {
    cy.visit('/tree') // Visit the tree route
  })

  it('should navigate to the Settings page and display the correct content', () => {
    cy.visit('/settings') // Visit the settings route
    cy.contains('Settings') // Check if "Settings" page content is displayed
  })

  it('should navigate to the Terminal page and display the correct content', () => {
    cy.visit('/terminal') // Visit the terminal route
  })

  it('should navigate to a 404 Error page and display 404 error not found', () => {
    cy.visit('/*')
  })
})