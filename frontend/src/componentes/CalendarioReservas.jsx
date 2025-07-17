import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { es } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    const cargarReservas = async () => {
      const prestadorData = JSON.parse(localStorage.getItem('prestador'));
      if (!prestadorData || !prestadorData.id) return;
      try {
        const res = await axios.get(`${API_URL}/reservas/provider/${prestadorData.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Solo reservas activas (pendiente o aceptada)
        const activas = res.data.filter(r => r.status === 'pendiente' || r.status === 'aceptada');
        setReservas(activas);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    };
    cargarReservas();
  }, []);

  // Días con reservas
  const fechasReservadas = reservas.map(r => new Date(r.date + 'T00:00:00'));

  // Al seleccionar un día, mostrar detalles de reservas de ese día
  const handleChange = (date) => {
    setFechaSeleccionada(date);
    const detallesDia = reservas.filter(r => {
      const fechaReserva = new Date(r.date + 'T00:00:00');
      return (
        fechaReserva.getFullYear() === date.getFullYear() &&
        fechaReserva.getMonth() === date.getMonth() &&
        fechaReserva.getDate() === date.getDate()
      );
    });
    setDetalles(detallesDia);
  };

  // Personalizar días con reservas
  const highlightWithRanges = [
    {
      'react-datepicker__day--highlighted-custom-1': fechasReservadas,
    },
  ];

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Calendario de Reservas</h2>
      <DatePicker
        locale={es}
        inline
        selected={fechaSeleccionada}
        onChange={handleChange}
        highlightDates={highlightWithRanges}
        placeholderText="Selecciona un día"
        calendarClassName="calendario-reservas"
      />
      {fechaSeleccionada && (
        <div style={{ marginTop: 20 }}>
          <h3>Reservas para el {fechaSeleccionada.toLocaleDateString('es-AR')}</h3>
          {detalles.length === 0 ? (
            <p>No hay reservas para este día.</p>
          ) : (
            <ul>
              {detalles.map(r => (
                <li key={r._id} style={{ marginBottom: 8 }}>
                  <b>Mascota:</b> {r.pet?.name} <br />
                  <b>Usuario:</b> {r.user?.fullName || r.user?.email} <br />
                  <b>Hora:</b> {r.time} <br />
                  <b>Estado:</b> {r.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 