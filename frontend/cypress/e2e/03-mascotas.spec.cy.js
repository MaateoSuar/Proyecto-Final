describe('Pruebas de Gestión de Mascotas', () => {
  beforeEach(() => {
    cy.login('usuario@test.com', 'password123')
    cy.visit('/mascotas')
  })

  it('Debería permitir registrar una nueva mascota', () => {
    cy.get('[data-cy=nueva-mascota]').click()
    cy.get('[data-cy=nombre-mascota]').type('Max')
    cy.get('[data-cy=tipo-mascota]').select('Perro')
    cy.get('[data-cy=edad-mascota]').type('3')
    cy.get('[data-cy=guardar-mascota]').click()
    cy.get('[data-cy=mascota-lista]').should('contain', 'Max')
  })

  it('Debería permitir editar una mascota existente', () => {
    cy.get('[data-cy=editar-mascota]').first().click()
    cy.get('[data-cy=nombre-mascota]').clear().type('Max Actualizado')
    cy.get('[data-cy=guardar-mascota]').click()
    cy.get('[data-cy=mascota-lista]').should('contain', 'Max Actualizado')
  })
})
