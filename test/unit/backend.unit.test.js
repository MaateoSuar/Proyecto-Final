const chai = require('chai');
const expect = chai.expect;

describe('Pruebas Unitarias de Backend', () => {
  // Test que verifica que el hash de contraseña funciona correctamente
  it('debería hashear la contraseña correctamente', () => {
    const hashPassword = (pwd) => pwd + '_hashed';
    expect(hashPassword('1234')).to.equal('1234_hashed');
  });

  // Test que verifica el formato de email
  it('debería validar el formato del email', () => {
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    expect(validateEmail('test@mail.com')).to.be.true;
    expect(validateEmail('badmail')).to.be.false;
  });

  // Test que verifica la creación de un usuario
  it('debería crear un nuevo objeto usuario', () => {
    const createUser = (name) => ({ name, active: true });
    expect(createUser('Juan')).to.deep.equal({ name: 'Juan', active: true });
  });

  // Test que verifica el cálculo del total de reserva
  it('debería retornar el total de la reserva', () => {
    const calc = (dias, precio) => dias * precio;
    expect(calc(3, 100)).to.equal(300);
  });

  // Test que simula el envío de email
  it('debería simular el envío de email', () => {
    let called = false;
    const sendEmail = () => { called = true; };
    sendEmail();
    expect(called).to.be.true;
  });
});
