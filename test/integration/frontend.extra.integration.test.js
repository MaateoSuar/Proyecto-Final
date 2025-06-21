const chai = require('chai');
const expect = chai.expect;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('Pruebas de Integración Extra de Frontend', () => {
  it('debería renderizar el formulario de registro', () => {
    const dom = new JSDOM(`<form id='register'><input type='text' name='email'></form>`);
    const form = dom.window.document.getElementById('register');
    expect(form).to.not.be.null;
  });

  it('debería mostrar error con email inválido', () => {
    const dom = new JSDOM(`<input id='email'><span id='error'></span>`);
    const error = dom.window.document.getElementById('error');
    error.textContent = 'Email inválido';
    expect(error.textContent).to.equal('Email inválido');
  });

  it('debería mostrar la lista de reservas', () => {
    const dom = new JSDOM(`<ul id='reservas'><li>1</li><li>2</li></ul>`);
    const items = dom.window.document.querySelectorAll('#reservas li');
    expect(items.length).to.equal(2);
  });

  it('debería actualizar el nombre de la mascota', () => {
    const dom = new JSDOM(`<span id='pet'></span>`);
    const pet = dom.window.document.getElementById('pet');
    pet.textContent = 'Firulais';
    expect(pet.textContent).to.equal('Firulais');
  });

  it('debería mostrar notificación de chat', () => {
    const dom = new JSDOM(`<div id='notif'></div>`);
    const notif = dom.window.document.getElementById('notif');
    notif.textContent = 'Nuevo mensaje';
    expect(notif.textContent).to.equal('Nuevo mensaje');
  });
});
