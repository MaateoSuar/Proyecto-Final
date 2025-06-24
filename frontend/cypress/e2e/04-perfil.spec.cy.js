describe('Pruebas de Perfil de Usuario', () => {
  beforeEach(() => {
    cy.login('francoalejandrolemos@gmail.com', 'Eleven4224')
    cy.visit('/profile')
  })

  it('Debería permitir actualizar información del perfil', () => {
    cy.get('.edit-button').click()
    cy.get('input[name="name"]').clear().type('Juan Perez Actualizado')
    cy.get('input[name="phone"]').clear().type('123456789')
    cy.get('input[name="address"]').clear().type('Nueva Dirección 123')
    cy.get('.save-button').click()
    cy.contains('¡Datos guardados correctamente!').should('exist')
    cy.url().should('include', '/inicio')
  })

  it('Debería mostrar información correcta del perfil', () => {
    cy.contains('Nombre').should('be.visible')
    cy.contains('Email').should('be.visible')
    cy.contains('Teléfono').should('be.visible')
    cy.contains('Dirección').should('be.visible')
  })

  it('Debería permitir cambiar a modo edición y cancelar', () => {
    cy.get('input[name="name"]').should('be.disabled')
    cy.get('input[name="phone"]').should('be.disabled')
    cy.get('input[name="address"]').should('be.disabled')
    cy.get('.edit-button').click()
    cy.get('input[name="name"]').should('not.be.disabled')
    cy.get('input[name="phone"]').should('not.be.disabled')
    cy.get('input[name="address"]').should('not.be.disabled')
    cy.get('.edit-button').click()
    cy.get('input[name="name"]').should('be.disabled')
    cy.get('input[name="phone"]').should('be.disabled')
    cy.get('input[name="address"]').should('be.disabled')
  })

  it('Debería mostrar el botón de cambiar contraseña en modo edición', () => {
    cy.get('.edit-button').click()
    cy.contains('Cambiar contraseña').should('be.visible')
  })
})
