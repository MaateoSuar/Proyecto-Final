import React, { useEffect, useState } from 'react';
import '../estilos/historialreservashome.css';

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {

    const reservasEjemplo = [
      {
        nombreMascota: 'Firulais',
        servicio: 'Paseo',
        fecha: '2025-05-30',
        estado: 'pendiente'
      },
      {
        nombreMascota: 'Luna',
        servicio: 'Peluquería',
        fecha: '2025-06-01',
        estado: 'confirmada'
      },
      {
        nombreMascota: 'Toby',
        servicio: 'Cuidado',
        fecha: '2025-06-05',
        estado: 'pendiente'
      }
    ];

    setReservas(reservasEjemplo);
  }, []);

  const pendientes = reservas.filter(reserva => reserva.estado === 'pendiente');

  return (
    <div className="reservas-pendientes-container">
      <h2 className="titulo">Reservas Pendientes</h2>
      {pendientes.length === 0 ? (
        <p className="sin-reservas">No tienes reservas pendientes.</p>
      ) : (
        <ul className="lista-reservas">
          {pendientes.map((reserva, index) => (
            <li key={index} className="reserva-item">
              <div className="info-reserva">
                <p><strong>Mascota:</strong> {reserva.nombreMascota}</p>
                <p><strong>Servicio:</strong> {reserva.servicio}</p>
                <p><strong>Fecha:</strong> {reserva.fecha}</p>
              </div>
              <span className="estado estado-pendiente">Pendiente</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistorialReservas;
