describe('Pruebas de Registro', () => {
  beforeEach(() => {
    cy.visit('/registro')
  })

  it('Debería permitir un registro exitoso', () => {
    cy.get('[data-cy=nombre]').type('Juan Perez')
    cy.get('[data-cy=email]').type('nuevo.usuario@test.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=confirm-password]').type('password123')
    cy.get('[data-cy=registro-btn]').click()
    cy.url().should('include', '/login')
    cy.get('[data-cy=success-message]').should('be.visible')
  })

  it('Debería validar campos requeridos', () => {
    cy.get('[data-cy=registro-btn]').click()
    cy.get('[data-cy=error-nombre]').should('be.visible')
    cy.get('[data-cy=error-email]').should('be.visible')
    cy.get('[data-cy=error-password]').should('be.visible')
  })
})
