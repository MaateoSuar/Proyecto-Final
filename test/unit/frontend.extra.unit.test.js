const chai = require('chai');
const expect = chai.expect;

describe('Pruebas Unitarias Extra de Frontend', () => {

  it('debería alternar el estado del modal', () => {
    let open = false;
    const toggle = () => open = !open;
    toggle();
    expect(open).to.be.true;
  });


  it('debería ordenar las reservas por fecha', () => {
    const sort = (arr) => arr.sort((a,b)=>a.date.localeCompare(b.date));
    const sorted = sort([{date:'2025-07-01'},{date:'2025-01-01'}]);
    expect(sorted[0].date).to.equal('2025-01-01');
  });


  it('debería deshabilitar el botón si está cargando', () => {
    const isDisabled = (loading) => loading;
    expect(isDisabled(true)).to.be.true;
  });


  it('debería obtener los nombres de las mascotas', () => {
    const pets = [{name:'a'},{name:'b'}];
    expect(pets.map(p=>p.name)).to.deep.equal(['a','b']);
  });

  it('debería renderizar las estrellas para el rating', () => {
    const renderStars = (n) => '★'.repeat(n);
    expect(renderStars(3)).to.equal('★★★');
  });


  it('debería retornar el color correcto según el estado', () => {
    const getStatusColor = (status) => status === 'activo' ? 'green' : 'red';
    expect(getStatusColor('activo')).to.equal('green');
    expect(getStatusColor('inactivo')).to.equal('red');
  });


  it('debería calcular el total de la reserva', () => {
    const calcTotal = (dias, precio) => dias * precio;
    expect(calcTotal(3, 200)).to.equal(600);
  });


  it('debería limpiar el usuario al cerrar sesión', () => {
    let user = { name: 'Juan' };
    const logout = () => { user = null; };
    logout();
    expect(user).to.be.null;
  });


  it('debería ser inválido si el formulario está incompleto', () => {
    const isValid = (fields) => Object.values(fields).every(f => !!f);
    expect(isValid({email:'a@mail.com',pass:''})).to.be.false;
  });

  it('debería retornar el avatar según el rol', () => {

    const getAvatar = (role) => role === 'admin' ? 'admin.png' : 'user.png';
    expect(getAvatar('admin')).to.equal('admin.png');
    expect(getAvatar('user')).to.equal('user.png');
  });


  it('should count pets correctly', () => {
    const countPets = (pets) => pets.length;
    expect(countPets(['dog','cat','bird'])).to.equal(3);
  });


  it('should filter active caretakers', () => {
    const caretakers = [
      {name:'Ana',active:true},
      {name:'Luis',active:false}
    ];
    const active = caretakers.filter(c=>c.active);
    expect(active).to.deep.equal([{name:'Ana',active:true}]);
  });


  it('should get welcome message', () => {
    const getMessage = (name) => `Bienvenido, ${name}!`;
    expect(getMessage('Juan')).to.equal('Bienvenido, Juan!');
  });
});
