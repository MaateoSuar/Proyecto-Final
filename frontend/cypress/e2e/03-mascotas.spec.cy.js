describe('Registro de mascotas', () => {


  it('RegistroMascota', function() {

    cy.visit('http://localhost:5173/login');
    cy.get('#correo').type('francoalejandrolemos@gmail.com');
    cy.get('#contrasena').type('Eleven4224');
    cy.get('.boton-login').click()
    cy.url().should('include', '/inicio')
    cy.visit('http://localhost:5173/registromascota');
    cy.get('.nameInput').type('Max');
    cy.get(':nth-child(1) > .input').type('Pomeranian');
    cy.get(':nth-child(3) > .input').type('8');
    cy.get(':nth-child(8) > .input').type('Todas');
    cy.get(':nth-child(8) > .addBtn').click();
    cy.get(':nth-child(6) > .input').type('Ninguna');
    cy.get(':nth-child(6) > .addBtn').click();
    cy.get('.button').click();
    cy.url().should('include', '/inicio')
  });


  it('EliminarMascota', function() {
    cy.visit('http://localhost:5173/inicio');
    cy.get('#correo').clear('francoalejandrolemos@gmail.com');
    cy.get('#correo').type('francoalejandrolemos@gmail.com');
    cy.get('#contrasena').clear('E');
    cy.get('#contrasena').type('Eleven4224');
    cy.get('.boton-login').click();
    cy.get('.pets-box > .pets > :nth-child(2) > .pet-img > .pet-edit').click();
    cy.get('.delete-button').click();
    cy.get('.confirm').click();

  });
})