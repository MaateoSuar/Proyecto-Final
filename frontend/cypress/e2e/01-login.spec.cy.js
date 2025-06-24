describe('Pruebas de Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Debería permitir un login exitoso', () => {
    cy.get('#correo').type('francoalejandrolemos@gmail.com')
    cy.get('#contrasena').type('Eleven4224')
    cy.get('.boton-login').click()
    cy.url().should('include', '/inicio')
  })

  it('Debería mostrar error con credenciales inválidas', () => {
    cy.get('#correo').type('usuario@test.com')
    cy.get('#contrasena').type('password123')
    cy.get('.boton-login').click()
    cy.get('.Toastify__toast--error').should('be.visible')
  })
})
