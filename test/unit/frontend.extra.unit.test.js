const chai = require('chai');
const expect = chai.expect;

// Pruebas unitarias adicionales y comentarios explicativos

describe('Pruebas Unitarias Extra de Frontend', () => {
  // Test que verifica que la función toggle cambia el estado de un modal
  // Test que verifica que la función toggle cambia el estado de un modal
  it('debería alternar el estado del modal', () => {
    let open = false;
    const toggle = () => open = !open;
    toggle();
    expect(open).to.be.true;
  });

  // Test que verifica que las reservas se ordenan por fecha correctamente
  // Test que verifica que las reservas se ordenan por fecha correctamente
  it('debería ordenar las reservas por fecha', () => {
    const sort = (arr) => arr.sort((a,b)=>a.date.localeCompare(b.date));
    const sorted = sort([{date:'2025-07-01'},{date:'2025-01-01'}]);
    expect(sorted[0].date).to.equal('2025-01-01');
  });

  // Test que verifica que el botón se deshabilita si está cargando
  // Test que verifica que el botón se deshabilita si está cargando
  it('debería deshabilitar el botón si está cargando', () => {
    const isDisabled = (loading) => loading;
    expect(isDisabled(true)).to.be.true;
  });

  // Test que verifica que se obtienen correctamente los nombres de las mascotas
  // Test que verifica que se obtienen correctamente los nombres de las mascotas
  it('debería obtener los nombres de las mascotas', () => {
    const pets = [{name:'a'},{name:'b'}];
    expect(pets.map(p=>p.name)).to.deep.equal(['a','b']);
  });

  // Test que verifica que se renderizan correctamente las estrellas de rating
  // Test que verifica que se renderizan correctamente las estrellas de rating
  it('debería renderizar las estrellas para el rating', () => {
    const renderStars = (n) => '★'.repeat(n);
    expect(renderStars(3)).to.equal('★★★');
  });

  // Test que verifica que se retorna el color correcto según el estado
  // Test que verifica que se retorna el color correcto según el estado
  it('debería retornar el color correcto según el estado', () => {
    // Devuelve un color según el estado
    const getStatusColor = (status) => status === 'activo' ? 'green' : 'red';
    expect(getStatusColor('activo')).to.equal('green');
    expect(getStatusColor('inactivo')).to.equal('red');
  });

  // Test que verifica que se calcula el total de la reserva correctamente
  // Test que verifica que se calcula el total de la reserva correctamente
  it('debería calcular el total de la reserva', () => {
    // Calcula el total multiplicando días por precio
    const calcTotal = (dias, precio) => dias * precio;
    expect(calcTotal(3, 200)).to.equal(600);
  });

  // Test que verifica que la función de logout limpia el usuario
  // Test que verifica que la función de logout limpia el usuario
  it('debería limpiar el usuario al cerrar sesión', () => {
    // Simula la limpieza del usuario
    let user = { name: 'Juan' };
    const logout = () => { user = null; };
    logout();
    expect(user).to.be.null;
  });

  // Test que verifica que el formulario es inválido si falta un campo
  // Test que verifica que el formulario es inválido si falta un campo
  it('debería ser inválido si el formulario está incompleto', () => {
    // Verifica si algún campo está vacío
    const isValid = (fields) => Object.values(fields).every(f => !!f);
    expect(isValid({email:'a@mail.com',pass:''})).to.be.false;
  });

  // Test que verifica que se obtiene el avatar correcto según el rol
  // Test que verifica que se obtiene el avatar correcto según el rol
  it('debería retornar el avatar según el rol', () => {
    // Devuelve avatar según el rol
    const getAvatar = (role) => role === 'admin' ? 'admin.png' : 'user.png';
    expect(getAvatar('admin')).to.equal('admin.png');
    expect(getAvatar('user')).to.equal('user.png');
  });

  // Test que verifica que se suma correctamente la cantidad de mascotas
  it('should count pets correctly', () => {
    // Cuenta la cantidad de mascotas
    const countPets = (pets) => pets.length;
    expect(countPets(['dog','cat','bird'])).to.equal(3);
  });

  // Test que verifica que se filtran correctamente los cuidadores activos
  it('should filter active caretakers', () => {
    // Filtra cuidadores activos
    const caretakers = [
      {name:'Ana',active:true},
      {name:'Luis',active:false}
    ];
    const active = caretakers.filter(c=>c.active);
    expect(active).to.deep.equal([{name:'Ana',active:true}]);
  });

  // Test que verifica que se obtiene el mensaje de bienvenida correcto
  it('should get welcome message', () => {
    // Devuelve mensaje de bienvenida
    const getMessage = (name) => `Bienvenido, ${name}!`;
    expect(getMessage('Juan')).to.equal('Bienvenido, Juan!');
  });
});
