import * as chai from 'chai';
// o, más común:
import { expect, should } from 'chai';

import sinon from 'sinon';
import axios from 'axios';

// Suponemos que guardas la función en un archivo tipo servicios/ubicacionService.js
import { guardarUbicacion } from '../../src/utils/ubi.js';

describe('guardarUbicacion', () => {
  let postStub;

  beforeEach(() => {
    postStub = sinon.stub(axios, 'post');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('debería guardar una ubicación y devolver el objeto guardado', async () => {
    const ubicacionMock = {
      nombre: 'Casa',
      tipo: 'casa',
      calle: 'Gran Via',
      numero: '123',
      referencia: 'Cerca del metro'
    };

    const respuestaMock = {
      _id: 'abc123',
      ...ubicacionMock,
      coordenadas: { lat: 40.4168, lng: -3.7038 },
      predeterminada: true
    };

    postStub.resolves({ data: respuestaMock });

    const resultado = await guardarUbicacion(ubicacionMock);

    expect(postStub.calledOnce).to.be.true;
    expect(postStub.firstCall.args[0]).to.equal('/api/ubicaciones');
    expect(postStub.firstCall.args[1]).to.deep.equal(ubicacionMock);

    expect(resultado).to.have.property('_id');
    expect(resultado.nombre).to.equal('Casa');
    expect(resultado.coordenadas).to.deep.equal({ lat: 40.4168, lng: -3.7038 });
  });

  it('debería lanzar error si falla la petición', async () => {
    const ubicacionMock = {
      nombre: 'Casa',
      tipo: 'casa',
      calle: 'Gran Via',
      numero: '123',
      referencia: 'Cerca del metro'
    };

    postStub.rejects(new Error('Error de red'));

    try {
      await guardarUbicacion(ubicacionMock);
      throw new Error('La función no lanzó error');
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal('Error de red');
    }
  });
});
