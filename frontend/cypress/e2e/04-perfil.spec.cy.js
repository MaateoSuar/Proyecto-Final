describe('Pruebas de Perfil de Usuario', () => {
  beforeEach(() => {
    cy.login('usuario@test.com', 'password123')
    cy.visit('/perfil')
  })

  it('Debería permitir actualizar información del perfil', () => {
    cy.get('[data-cy=editar-perfil]').click()
    cy.get('[data-cy=nombre]').clear().type('Juan Perez Actualizado')
    cy.get('[data-cy=email]').clear().type('nuevo.email@test.com')
    cy.get('[data-cy=guardar-perfil]').click()
    cy.get('[data-cy=perfil-nombre]').should('contain', 'Juan Perez Actualizado')
  })

  it('Debería mostrar información correcta del perfil', () => {
    cy.get('[data-cy=perfil-nombre]').should('be.visible')
    cy.get('[data-cy=perfil-email]').should('be.visible')
    cy.get('[data-cy=mascotas-perfil]').should('be.visible')
  })
})
