const chai = require('chai');
const expect = chai.expect;

describe('Pruebas Unitarias Extra de Backend', () => {

  it('debería verificar el token correctamente', () => {
    const verify = (token) => token === 'valid';
    expect(verify('valid')).to.be.true;
    expect(verify('bad')).to.be.false;
  });

  it('debería verificar si el usuario está activo', () => {
    const isActive = (user) => user.active;
    expect(isActive({active:true})).to.be.true;
    expect(isActive({active:false})).to.be.false;
  });

  it('debería agregar una mascota al usuario', () => {
    const addPet = (user, pet) => { user.pets = user.pets || []; user.pets.push(pet); return user; };
    expect(addPet({name:'A'}, 'dog').pets).to.include('dog');
  });

  it('debería formatear el mensaje de chat', () => {
    const formatMsg = (msg) => `[MSG] ${msg}`;
    expect(formatMsg('hola')).to.equal('[MSG] hola');
  });
});
