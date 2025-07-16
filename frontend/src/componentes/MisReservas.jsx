import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ChatReserva from './ChatReserva';
import '../estilos/MisReservas.css';
import { useSearchParams } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

const MisReservas = () => {
  const [searchParams] = useSearchParams();
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reservaAValorar, setReservaAValorar] = useState(null);

  const [reservaEnChat, setReservaEnChat] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reservaAReportar, setReservaAReportar] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState("");

  useEffect(() => {
    const chatReservaId = searchParams.get('chat');
    if (chatReservaId && reservas.length > 0) {
      const encontrada = reservas.find(r => r._id === chatReservaId);
      if (encontrada) {
        setReservaEnChat(encontrada);
      }
    }
  }, [searchParams, reservas]);

  useEffect(() => {
    cargarReservas();
  }, []);

  useEffect(() => {
    const socket = window.socket;
    if (!socket) return;

    const handleNotificacionReserva = (data) => {
      console.log('🔔 Notificación recibida:', data); // Agregá este log
      toast.info(data.mensaje || 'Nueva reserva recibida');
      cargarReservas();
    };

    socket.on('notificacionReserva', handleNotificacionReserva);

    return () => {
      socket.off('notificacionReserva', handleNotificacionReserva);
    };
  }, []);


  const statusOrder = {
    aceptada: 1,
    pendiente: 2,
    completada: 3,
    cancelada: 4
  };

  const updateReserva = async (reservaId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/reservas/${reservaId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarReservas();
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      toast.error('No se pudo actualizar la reserva');
    }
  };

  const cargarReservas = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para ver tus reservas');
      return;
    }

    try {
      let reservasData = [];

      if (localStorage.getItem('usuario')) {
        const response = await axios.get(`${API_URL}/reservas`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        reservasData = response.data.sort((a, b) => {
          return statusOrder[a.status] - statusOrder[b.status];
        });

      } else if (localStorage.getItem('prestador')) {
        const prestadorData = JSON.parse(localStorage.getItem('prestador'));
        if (!prestadorData || !prestadorData.id) {
          toast.error('Error cargando el perfil del prestador');
          return;
        }

        const res = await axios.get(`${API_URL}/reservas/provider/${prestadorData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        reservasData = res.data;
      }

      setReservas(reservasData);
      console.log(reservasData);

    } catch (error) {
      console.error('Error al cargar reservas:', error);
      toast.error('No se pudieron cargar tus reservas');
    } finally {
      setIsLoading(false);
    }
  };


  const cancelarReserva = async (reservaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarReservas();
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
        <p><b>Proveedor:</b> {reserva.provider.name}</p>
        <p><b>Fecha:</b> {formatearFechaCorta(reserva.date)} <b>Hora:</b> {reserva.time}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => toast.dismiss()}>Cancelar</button>
          <button onClick={() => { cancelarReserva(reserva._id); toast.dismiss(); }}>
            Confirmar
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

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

  const formatearFechaCorta = (isoDate) => {
    const fecha = new Date(isoDate);
    if (isNaN(fecha.getTime())) return ''; // Si la fecha no es válida, devolvemos string vacío
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(fecha);
  };

  const enviarReporte = async (e) => {
    e.preventDefault();
    if (!motivoReporte.trim()) return toast.error('Debes escribir un motivo para el reporte');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/reports`, {
        user: reservaAReportar.user._id,
        provider: reservaAReportar.provider._id,
        reason: motivoReporte
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('¡Reporte enviado!');
      cerrarFormularioReporte();
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('No se pudo enviar el reporte');
    }
  };

  if (isLoading) return <div className="reservas-loading">Cargando reservas...</div>;

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
        {reservas.map(reserva => (
          <div key={reserva._id} className="reserva-card">
            <div className="reserva-info">
              <div className="reserva-header">
                <h3>{reserva.provider.name}</h3>
              </div>
              <span className="reserva-date"> {formatearFechaCorta(reserva.date)} - {reserva.time}</span>
              {localStorage.getItem('prestador') && (<p className="reserva-pet">Usuario: <b>{reserva.user.fullName}</b></p>)}
              <p className="reserva-pet">Mascota: <b>{reserva.pet.name}</b></p>
              <b className="reserva-status">{reserva.status}</b>
            </div>

            {/* Acciones condicionales */}
            {reserva.status === 'cancelada' && (
              <span className="reserva-cancelled">Sin acciones</span>
            )}
            {reserva.status !== 'cancelada' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reserva.status === 'pendiente' && (
                  <>
                    <button className='chat-button' onClick={() => setReservaEnChat(reserva)}>Chatear</button>
                    <button className="cancel-button" onClick={() => confirmarCancelacion(reserva)}>
                      Cancelar
                    </button>
                    {localStorage.getItem('prestador') && (<button className="complete-button" onClick={() => updateReserva(reserva._id, 'completada')}>
                      Completar
                    </button>)}
                  </>
                )}
                {reserva.status === 'completada' && !reserva.comment && !reserva.rating && localStorage.getItem('usuario') && (
                  <button className="review-btn" onClick={() => {
                    setReservaAValorar(reserva);
                    setShowReviewModal(true);
                  }}>
                    Dejar valoración
                  </button>
                )}
                {reserva.status === 'completada' && reserva.comment && reserva.rating && localStorage.getItem('usuario') && (
                  <span style={{ fontWeight: 600, color: '#28a745' }}>Valoración enviada</span>
                )}
                {reserva.status === 'completada' && localStorage.getItem('usuario') && (
                  <button className="report-btn" onClick={() => abrirFormularioReporte(reserva)}>
                    Reportar
                  </button>
                )}
                {reserva.status === 'completada' && localStorage.getItem('prestador') && (
                  <span className="reserva-cancelled">Sin acciones</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de reporte */}
      {showReportModal && reservaAReportar && (
        <div className="modal-reporte">
          <div className="modal-reporte-form">
            <h3>Reportar Reserva</h3>
            <p><b>Proveedor:</b> {reservaAReportar.provider.name}</p>
            <p><b>Fecha:</b> {formatearFechaCorta(reservaAReportar.date)} <b>Hora:</b> {reservaAReportar.time}</p>
            <form onSubmit={enviarReporte}>
              <textarea
                value={motivoReporte}
                onChange={e => setMotivoReporte(e.target.value)}
                placeholder="Describe el motivo del reporte..."
                rows={4}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={cerrarFormularioReporte}>Cancelar</button>
                <button type="submit">Enviar Reporte</button>
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
            setReservas(prev =>
              prev.map(r =>
                r._id === reservaAValorar._id ? { ...r, comment, rating } : r
              )
            );
          }}
        />
      )}
      {reservaEnChat && (
        <ChatReserva
          reservaId={reservaEnChat._id}
          onClose={() => setReservaEnChat(null)}
        />
      )}
    </div>
  );
};

export default MisReservas;
