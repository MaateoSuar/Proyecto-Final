// test/logout.test.js
import { handleLogout } from '../../src/utils/logout.js';
import assert from 'assert';
import sinon from 'sinon';

describe('handleLogout', () => {
  it('debería limpiar localStorage y redirigir a /login', () => {
    // Simular localStorage
    const clearSpy = sinon.spy();
    global.localStorage = { clear: clearSpy };

    // Simular navigate
    const navigateMock = sinon.spy();

    // Ejecutar la función
    handleLogout(navigateMock);

    // Aserciones
    assert(clearSpy.calledOnce, 'localStorage.clear() no fue llamado');
    assert(navigateMock.calledOnceWith('/login'), 'navigate no fue llamado con "/login"');
  });
});
