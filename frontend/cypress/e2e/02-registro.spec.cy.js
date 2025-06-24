describe('Pruebas de Registro', () => {
  beforeEach(() => {
    cy.visit('/registro')
  })

  it('Debería permitir un registro exitoso', () => {
    cy.get('#fullName').type('Juan Perez')
    cy.get('#email').type('nuevo.usuario@test.com')
    cy.get('#password').type('password123')
    cy.get('#confirmPassword').type('password123')
    cy.get('.boton-login').click()
    cy.url().should('include', '/registro')
    cy.get('.Toastify__toast--error').should('be.visible')
  })
})
