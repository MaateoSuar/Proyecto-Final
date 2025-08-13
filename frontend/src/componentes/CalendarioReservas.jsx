import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import '../estilos/calendarioReservas.css';
import { es } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

export default function CalendarioReservas() {
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [detalles, setDetalles] = useState([]);

  // Función para parsear fecha sin que se cambie por la zona horaria
  const parseFechaLocal = (isoDate) => {
    if (!isoDate) return null;
    const fechaObj = new Date(isoDate);
    return new Date(
      fechaObj.getUTCFullYear(),
      fechaObj.getUTCMonth(),
      fechaObj.getUTCDate()
    );
  };

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
  const fechasReservadas = reservas
    .map(r => parseFechaLocal(r.date))
    .filter(fecha => fecha !== null);

  // Al seleccionar un día
  const handleChange = (date) => {
    if (!date) {
      setFechaSeleccionada(null);
      setDetalles([]);
      return;
    }

    setFechaSeleccionada(date);
    const detallesDia = reservas.filter(r => {
      const fechaReserva = parseFechaLocal(r.date);
      return (
        fechaReserva.getFullYear() === date.getFullYear() &&
        fechaReserva.getMonth() === date.getMonth() &&
        fechaReserva.getDate() === date.getDate()
      );
    });
    setDetalles(detallesDia);
  };

  // Resaltar días
  const highlightWithRanges = fechasReservadas.length > 0 ? [
    {
      'react-datepicker__day--highlighted-custom-1': fechasReservadas,
    },
  ] : [];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 26 }}>Calendario de Reservas</h2>

      <div className="contenedor-calendario-detalles" style={{marginBottom: 20}}>
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
          <div className="panel-detalles">
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
    </div>
  );
}