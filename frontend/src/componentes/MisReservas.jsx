import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import '../estilos/MisReservas.css';

const API_URL = import.meta.env.VITE_API_URL;

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reservaAValorar, setReservaAValorar] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reservaAReportar, setReservaAReportar] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState("");

  const abrirFormularioReporte = (reserva) => {
    setReservaAReportar(reserva);
    setMotivoReporte("");
    setShowReportModal(true);
  };

  const cerrarFormularioReporte = () => {
    setShowReportModal(false);
    setReservaAReportar(null);
    setMotivoReporte("");
  };

  const enviarReporte = (e) => {
    e.preventDefault();
    // Aquí podrías enviar el reporte al backend
    toast.success("¡Reporte enviado! Gracias por tu colaboración.");
    cerrarFormularioReporte();
  };

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
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Solo permitir cancelar si no está completada */}
              {reserva.status !== 'completada' && (
                <button
                  className="cancel-button"
                  onClick={() => confirmarCancelacion(reserva)}
                >
                  Cancelar Reserva
                </button>
              )}
              {/* Solo permitir reportar si está completada */}
              {reserva.status === 'completada' && (
                <button
                  className="report-btn"
                  onClick={() => abrirFormularioReporte(reserva)}
                >
                  Reportar Reserva
                </button>
              )}
              {/* Botón para dejar review solo si está completada y no tiene review */}
              {reserva.status === 'completada' && !(reserva.comment && reserva.rating) && (
                <button
                  className="review-btn"
                  onClick={() => {
                    setReservaAValorar(reserva);
                    setShowReviewModal(true);
                  }}
                >
                  Dejar valoración
                </button>
              )}
              {/* Mostrar mensaje si ya fue valorada */}
              {reserva.status === 'completada' && reserva.comment && reserva.rating && (
                <span className="reserva-valorada" style={{ color: '#28a745', fontWeight: 'bold' }}>
                  ¡Ya valoraste esta reserva!
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de reporte */}
      {showReportModal && reservaAReportar && (
        <div className="modal-reporte">
          <div className="modal-reporte-form">
            <div className="modal-reporte-title">Reportar Reserva</div>
            <p><b>Proveedor:</b> {reservaAReportar.provider.name}</p>
            <p><b>Fecha:</b> {reservaAReportar.date} <b>Hora:</b> {reservaAReportar.time}</p>
            <form onSubmit={enviarReporte}>
              <div>
                <label htmlFor="motivo-reporte" className="modal-reporte-label">Motivo del reporte:</label>
                <textarea
                  id="motivo-reporte"
                  className="modal-reporte-textarea"
                  value={motivoReporte}
                  onChange={e => setMotivoReporte(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="modal-reporte-cancel"
                  onClick={cerrarFormularioReporte}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="modal-reporte-btn"
                >
                  Enviar Reporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de review */}
      {showReviewModal && reservaAValorar && (
        <ReviewForm
          reservaId={reservaAValorar._id}
          onClose={() => {
            setShowReviewModal(false);
            setReservaAValorar(null);
          }}
          onSubmit={async ({ comment, rating }) => {
            const token = localStorage.getItem('token');
            await axios.post(
              `${API_URL}/reservas/${reservaAValorar._id}/review`,
              { comment, rating },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('¡Valoración enviada!');
            // Actualizar reservas para reflejar la nueva review
            setReservas(prev => prev.map(r =>
              r._id === reservaAValorar._id ? { ...r, comment, rating } : r
            ));
          }}
        />
      )}
    </div>
  );
};

export default MisReservas;