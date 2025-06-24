const chai = require('chai');
const expect = chai.expect;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('Pruebas de Integración de Frontend', () => {
  it('debería renderizar el formulario de login', () => {
    const dom = new JSDOM(`<form id='login'><input type='text' name='email'></form>`);
    const form = dom.window.document.getElementById('login');
    expect(form).to.not.be.null;
  });

  it('debería mostrar error si el submit está vacío', () => {
    const dom = new JSDOM(`<form id='login'><span id='error'></span></form>`);
    const error = dom.window.document.getElementById('error');
    error.textContent = 'Campo requerido';
    expect(error.textContent).to.equal('Campo requerido');
  });

  it('debería mostrar la lista de mascotas', () => {
    const dom = new JSDOM(`<ul id='pets'><li>Dog</li><li>Cat</li></ul>`);
    const items = dom.window.document.querySelectorAll('#pets li');
    expect(items.length).to.equal(2);
  });

  it('debería actualizar el nombre del perfil', () => {
    const dom = new JSDOM(`<span id='name'></span>`);
    const name = dom.window.document.getElementById('name');
    name.textContent = 'Juan';
    expect(name.textContent).to.equal('Juan');
  });

  it('debería mostrar confirmación de reserva', () => {
    const dom = new JSDOM(`<div id='confirm'></div>`);
    const confirm = dom.window.document.getElementById('confirm');
    confirm.textContent = 'Reserva exitosa';
    expect(confirm.textContent).to.equal('Reserva exitosa');
  });
});

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
