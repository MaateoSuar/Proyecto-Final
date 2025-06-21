describe('Pruebas de Administración', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'admin123')
    cy.visit('/admin')
  })

  it('Debería permitir gestionar usuarios', () => {
    cy.get('[data-cy=usuarios-tab]').click()
    cy.get('[data-cy=usuarios-lista]').should('have.length.greaterThan', 0)
    cy.get('[data-cy=ver-detalle]').first().click()
    cy.get('[data-cy=usuario-detalle]').should('be.visible')
  })

  it('Debería permitir gestionar reportes', () => {
    cy.get('[data-cy=reportes-tab]').click()
    cy.get('[data-cy=reportes-lista]').should('have.length.greaterThan', 0)
    cy.get('[data-cy=ver-reporte]').first().click()
    cy.get('[data-cy=reporte-detalle]').should('be.visible')
  })
})
