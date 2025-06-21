describe('Pruebas de Búsqueda de Cuidadores', () => {
  beforeEach(() => {
    cy.login('usuario@test.com', 'password123')
    cy.visit('/cuidadores')
  })

  it('Debería permitir buscar cuidadores por ubicación', () => {
    cy.get('[data-cy=ubicacion]').type('Buenos Aires')
    cy.get('[data-cy=buscar-cuidador]').click()
    cy.get('[data-cy=cuidador-lista]').should('have.length.greaterThan', 0)
  })

  it('Debería mostrar detalles del cuidador seleccionado', () => {
    cy.get('[data-cy=cuidador-lista]').first().click()
    cy.get('[data-cy=detalles-cuidador]').should('be.visible')
    cy.get('[data-cy=calificaciones]').should('be.visible')
  })
})
