import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/historialreservashome.css';
import { getEstadoText } from '../utils/estadoReserva';

const API_URL = import.meta.env.VITE_API_URL;

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${API_URL}/reservas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filtrar reservas pendientes y ordenar por fecha
        const reservasPendientes = response.data
          .filter(reserva => reserva.status === 'pendiente')
          .sort((a, b) => {
            const fechaA = new Date(`${a.date} ${a.time}`);
            const fechaB = new Date(`${b.date} ${b.time}`);
            return fechaA - fechaB;
          })
          .slice(0, 3);

        setReservas(reservasPendientes);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      }
    };

    cargarReservas();
  }, []);

  const handleReservarClick = () => {
    navigate('/proveedores');
  };

  return (
    <div className="reservas-pendientes-container">
      {reservas.length === 0 ? (
        <div>
          <p className="sin-reservas">No hay reservas pendientes</p>
          <button 
            className="btn-reservar" 
            onClick={handleReservarClick}
          >
            Realizar una reserva
          </button>
        </div>
      ) : (
        <ul className="lista-reservas">
          {reservas.map((reserva) => (
            <li
              key={reserva._id}
              className="reserva-item"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/profile?tab=reservas')}
            >
              <div className="info-reserva">
                <p><strong>Mascota:</strong> {reserva.pet?.name}</p>
                <p><strong>Servicio:</strong> {reserva.provider?.name}</p>
                <p><strong>Fecha:</strong> {reserva.date} a las {reserva.time}</p>
              </div>
              <span className="estado estado-pendiente">{getEstadoText(reserva.status)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialReservas;
