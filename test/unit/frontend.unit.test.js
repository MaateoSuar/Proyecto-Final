const chai = require('chai');
const expect = chai.expect;

describe('Pruebas Unitarias de Frontend', () => {
  it('debería formatear el rating correctamente', () => {
    const formatRating = (r) => r.toFixed(1);
    expect(formatRating(4.567)).to.equal('4.6');
  });

  it('debería capitalizar el nombre', () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    expect(capitalize('juan')).to.equal('Juan');
  });

  it('debería devolver true si el usuario es admin', () => {
    const isAdmin = (role) => role === 'admin';
    expect(isAdmin('admin')).to.be.true;
    expect(isAdmin('user')).to.be.false;
  });

  it('debería filtrar mascotas por tipo', () => {
    const filterPets = (pets, type) => pets.filter(p => p.type === type);
    expect(filterPets([{type:'dog'},{type:'cat'}],'dog')).to.deep.equal([{type:'dog'}]);
  });

  it('debería retornar el avatar por defecto si no está definido', () => {
    const getAvatar = (url) => url || 'default.png';
    expect(getAvatar('')).to.equal('default.png');
    expect(getAvatar('a.png')).to.equal('a.png');
  });
});
