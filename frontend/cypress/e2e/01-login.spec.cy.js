describe('Pruebas de Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Debería permitir un login exitoso', () => {
    cy.get('[data-cy=email]').type('usuario@test.com')
    cy.get('[data-cy=password]').type('password123')
    cy.get('[data-cy=login-btn]').click()
    cy.url().should('include', '/home')
  })

  it('Debería mostrar error con credenciales inválidas', () => {
    cy.get('[data-cy=email]').type('usuario@invalido.com')
    cy.get('[data-cy=password]').type('wrongpassword')
    cy.get('[data-cy=login-btn]').click()
    cy.get('[data-cy=error-message]').should('be.visible')
  })
})
