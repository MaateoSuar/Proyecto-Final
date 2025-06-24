const chai = require('chai');
const expect = chai.expect;
const formatRating = require('../../frontend/src/utils/formatRating.js').default;
const { capitalize, isAdmin, getAvatar, filterPets } = require('../../frontend/src/utils/formatRating.js');

describe('Pruebas Unitarias de Frontend', () => {
  it('debería formatear el rating correctamente', () => {
    expect(formatRating(4.567)).to.equal('4.6');
  });

  it('debería capitalizar el nombre', () => {
    expect(capitalize('juan')).to.equal('Juan');
  });

  it('debería devolver true si el usuario es admin', () => {
    expect(isAdmin('admin')).to.be.true;
    expect(isAdmin('user')).to.be.false;
  });

  it('debería filtrar mascotas por tipo', () => {
    expect(filterPets([{type:'dog'},{type:'cat'}],'dog')).to.deep.equal([{type:'dog'}]);
  });

  it('debería retornar el avatar por defecto si no está definido', () => {
    expect(getAvatar('')).to.equal('default.png');
    expect(getAvatar('a.png')).to.equal('a.png');
  });
});
