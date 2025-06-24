describe('Pruebas de Cuidadores', () => {
  beforeEach(() => {
    cy.login('francoalejandrolemos@gmail.com', 'Eleven4224')
    cy.visit('/cuidadores')
  })

  it('Debería mostrar la lista de cuidadores', () => {
    cy.get('.care-person').should('have.length.greaterThan', 0)
    cy.contains('Enzo Fernandez').should('be.visible')
    cy.contains('Juan Benedetti').should('be.visible')
  })

  it('Debería mostrar detalles del cuidador seleccionado', () => {
    cy.get('.care-person').first().click()
    cy.contains('Experiencia:').should('be.visible')
    cy.get('h3').should('contain.text', 'Enzo Fernandez')
  })
})
