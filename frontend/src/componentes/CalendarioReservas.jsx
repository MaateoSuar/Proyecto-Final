import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import '../estilos/calendarioReservas.css'; // Asegúrate de tener estilos para el calendario
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

  // Días con reservas - con validación de fechas
  const fechasReservadas = reservas
    .map(r => {
      try {
        // Verificar que la fecha existe y es válida
        if (!r.date) return null;
        
        // Intentar parsear la fecha de diferentes formatos
        let fecha;
        if (r.date.includes('T')) {
          // Si ya tiene formato ISO
          fecha = new Date(r.date);
        } else {
          // Si es solo fecha, agregar tiempo
          fecha = new Date(r.date + 'T00:00:00');
        }
        
        // Verificar que la fecha es válida
        if (isNaN(fecha.getTime())) {
          console.warn('Fecha inválida encontrada:', r.date);
          return null;
        }
        
        return fecha;
      } catch (error) {
        console.error('Error al procesar fecha:', r.date, error);
        return null;
      }
    })
    .filter(fecha => fecha !== null); // Filtrar fechas nulas

  // Al seleccionar un día, mostrar detalles de reservas de ese día
  const handleChange = (date) => {
    if (!date) {
      setFechaSeleccionada(null);
      setDetalles([]);
      return;
    }

    setFechaSeleccionada(date);
    const detallesDia = reservas.filter(r => {
      try {
        if (!r.date) return false;
        
        let fechaReserva;
        if (r.date.includes('T')) {
          fechaReserva = new Date(r.date);
        } else {
          fechaReserva = new Date(r.date + 'T00:00:00');
        }
        
        if (isNaN(fechaReserva.getTime())) return false;
        
        return (
          fechaReserva.getFullYear() === date.getFullYear() &&
          fechaReserva.getMonth() === date.getMonth() &&
          fechaReserva.getDate() === date.getDate()
        );
      } catch (error) {
        console.error('Error al comparar fechas:', error);
        return false;
      }
    });
    setDetalles(detallesDia);
  };

  // Personalizar días con reservas - solo si hay fechas válidas
  const highlightWithRanges = fechasReservadas.length > 0 ? [
    {
      'react-datepicker__day--highlighted-custom-1': fechasReservadas,
    },
  ] : [];

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Calendario de Reservas</h2>

      <div className="contenedor-calendario-detalles">
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