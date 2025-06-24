import { strict as assert } from 'assert';
import sinon from 'sinon';
import axios from 'axios';
import { guardarReserva } from '../../src/utils/reservar.js';

describe('guardarReserva', () => {
  let postStub, putStub, cargarReservasStub, setIsLoadingStub, setSelectedTimeStub;
  let setMascotaSeleccionadaStub, setSelectedDateStub, setProveedorStub;
  let toastMock, navigateMock;

  beforeEach(() => {
    postStub = sinon.stub(axios, 'post');
    putStub = sinon.stub(axios, 'put');
    cargarReservasStub = sinon.stub().resolves();
    setIsLoadingStub = sinon.stub();
    setSelectedTimeStub = sinon.stub();
    setMascotaSeleccionadaStub = sinon.stub();
    setSelectedDateStub = sinon.stub();
    setProveedorStub = sinon.stub();
    toastMock = {
      success: sinon.stub(),
      error: sinon.stub()
    };
    navigateMock = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('debe guardar la reserva correctamente', async () => {
    postStub.resolves({ status: 201 });
    putStub.resolves();

    const proveedorMock = {
      availability: [
        { day: 'lunes', slots: ['10:00', '11:00'] },
        { day: 'martes', slots: ['12:00'] }
      ]
    };

    await guardarReserva({
      proveedorId: 'proveedor123',
      mascotaId: 'mascota456',
      dia: 'lunes',
      hora: '10:00',
      token: 'token123',
      cargarReservas: cargarReservasStub,
      setIsLoading: setIsLoadingStub,
      setSelectedTime: setSelectedTimeStub,
      setMascotaSeleccionada: setMascotaSeleccionadaStub,
      setSelectedDate: setSelectedDateStub,
      proveedor: proveedorMock,
      setProveedor: setProveedorStub,
      toast: toastMock,
      navigate: navigateMock
    });

    assert(postStub.calledOnce, 'axios.post no fue llamado');
    assert(putStub.calledOnce, 'axios.put no fue llamado');
    assert(cargarReservasStub.calledOnce, 'cargarReservas no fue llamado');
    assert(setIsLoadingStub.calledTwice, 'setIsLoading no fue llamado dos veces (inicio y fin)');
    assert(toastMock.success.calledOnce, 'toast.success no fue llamado');
    assert(setSelectedTimeStub.calledWith(null), 'setSelectedTime no fue llamado con null');
    assert(setMascotaSeleccionadaStub.calledWith(''), 'setMascotaSeleccionada no fue llamado con ""');
    assert(setSelectedDateStub.calledWith(null), 'setSelectedDate no fue llamado con null');
    assert(setProveedorStub.calledOnce, 'setProveedor no fue llamado');
    assert(navigateMock.notCalled, 'navigate no debería ser llamado');
  });

  it('debe manejar error 401 y redirigir', async () => {
    const error = { response: { status: 401 } };
    postStub.rejects(error);

    await guardarReserva({
      proveedorId: 'proveedor123',
      mascotaId: 'mascota456',
      dia: 'lunes',
      hora: '10:00',
      token: 'token123',
      cargarReservas: cargarReservasStub,
      setIsLoading: setIsLoadingStub,
      setSelectedTime: setSelectedTimeStub,
      setMascotaSeleccionada: setMascotaSeleccionadaStub,
      setSelectedDate: setSelectedDateStub,
      proveedor: {},
      setProveedor: setProveedorStub,
      toast: toastMock,
      navigate: navigateMock
    });

    assert(toastMock.error.calledWith('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'));
    assert(navigateMock.calledWith('/login'));
    assert(setIsLoadingStub.calledTwice);
  });

  // Podés agregar más tests para otros errores (404, 400, etc)
});
