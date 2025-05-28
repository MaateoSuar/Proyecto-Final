import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../estilos/MisReservas.css';

const API_URL = import.meta.env.VITE_API_URL;

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargarReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para ver tus reservas');
        return;
      }

      const response = await axios.get(`${API_URL}/reservas`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      toast.error('No se pudieron cargar tus reservas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cancelarReserva = async (reservaId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para cancelar la reserva');
        return;
      }

      await axios.delete(`${API_URL}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar la lista de reservas
      setReservas(prevReservas => prevReservas.filter(r => r._id !== reservaId));
      toast.success('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      toast.error('No se pudo cancelar la reserva');
    }
  };

  const confirmarCancelacion = (reserva) => {
    toast.warn(
      <div>
        <p>¿Estás seguro de que deseas cancelar esta reserva?</p>
        <p>Proveedor: {reserva.provider.name}</p>
        <p>Fecha: {reserva.date}</p>
        <p>Hora: {reserva.time}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              cancelarReserva(reserva._id);
              toast.dismiss();
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Confirmar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: true
      }
    );
  };

  if (isLoading) {
    return <div className="reservas-loading">Cargando reservas...</div>;
  }

  if (reservas.length === 0) {
    return (
      <div className="reservas-empty">
        <h3>No tienes reservas activas</h3>
        <p>Cuando hagas una reserva, aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="reservas-container">
      <h2>Mis Reservas</h2>
      <div className="reservas-list">
        {reservas.map((reserva) => (
          <div key={reserva._id} className="reserva-card">
            <div className="reserva-info">
              <div className="reserva-header">
                <h3>{reserva.provider.name}</h3>
                <span className="reserva-date">
                  {reserva.date} - {reserva.time}
                </span>
              </div>
              <p className="reserva-pet">Mascota: {reserva.pet.name}</p>
            </div>
            <button
              className="cancel-button"
              onClick={() => confirmarCancelacion(reserva)}
            >
              Cancelar Reserva
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisReservas; 