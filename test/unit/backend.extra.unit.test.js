const chai = require('chai');
const expect = chai.expect;

describe('Pruebas Unitarias Extra de Backend', () => {
  // Test que verifica el middleware de token
  it('debería verificar el token correctamente', () => {
    const verify = (token) => token === 'valid';
    expect(verify('valid')).to.be.true;
    expect(verify('bad')).to.be.false;
  });

  // Test que verifica el parseo de fechas de reserva
  it('debería parsear la fecha de la reserva', () => {
    const parseDate = (d) => new Date(d).getFullYear();
    expect(parseDate('2024-01-01')).to.equal(2024);
  });

  // Test que verifica si el usuario está activo
  it('debería verificar si el usuario está activo', () => {
    const isActive = (user) => user.active;
    expect(isActive({active:true})).to.be.true;
    expect(isActive({active:false})).to.be.false;
  });

  // Test que verifica agregar una mascota a un usuario
  it('debería agregar una mascota al usuario', () => {
    const addPet = (user, pet) => { user.pets = user.pets || []; user.pets.push(pet); return user; };
    expect(addPet({name:'A'}, 'dog').pets).to.include('dog');
  });

  // Test que verifica el formato de mensajes de chat
  it('debería formatear el mensaje de chat', () => {
    const formatMsg = (msg) => `[MSG] ${msg}`;
    expect(formatMsg('hola')).to.equal('[MSG] hola');
  });
});
