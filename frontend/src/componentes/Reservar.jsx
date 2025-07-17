// Reservar.jsx
import React, { useEffect, useState } from "react";
import formatRating from '../utils/formatRating';
import ComentariosProveedor from './ComentariosProveedor';
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import '../estilos/Reservar.css';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';
import StarRating from './ReviewForm';
import { useSocket } from '../context/SocketContext';


registerLocale('es', es);

const API_URL = import.meta.env.VITE_API_URL;

const Reservar = () => {
  const socket = useSocket();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [horariosDelBackend, setHorariosDelBackend] = useState([]);
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const [proveedor, setProveedor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 900 });

  function upper(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const userId = localStorage.getItem('usuario') && JSON.parse(localStorage.getItem('usuario')).id;

  const cargarReservas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Debes iniciar sesión para ver las reservas');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/reservas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      toast.error('No se pudieron cargar las reservas existentes');
    }
  };

  const abrirResumenReserva = () => {
    const validaciones = [];

    if (!selectedDate) validaciones.push("fecha");
    if (!selectedTime) validaciones.push("horario");
    if (!mascotaSeleccionada) validaciones.push("mascota");

    if (validaciones.length > 0) {
      toast.warning(`Por favor selecciona ${validaciones.join(", ")} para continuar`);
      return;
    }

    setShowConfirmModal(true);
  };

  const fetchProveedor = async () => {
    try {
      let dataProveedor;

      if (location.state?.provider) {
        dataProveedor = location.state.provider;
        if (dataProveedor.services && !Array.isArray(dataProveedor.services)) {
          dataProveedor.services = [dataProveedor.services];
        }
      } else {
        const res = await axios.get(`${API_URL}/prestadores/${id}`);
        if (!res.data.success) {
          throw new Error('No se pudo obtener la información del proveedor');
        }
        dataProveedor = res.data.data;
        // Si lo trae del backend directo, debería venir bien,
        // pero igual por seguridad:
        if (dataProveedor.services && !Array.isArray(dataProveedor.services)) {
          dataProveedor.services = [dataProveedor.services];
        }
      }

      if (!dataProveedor) {
        toast.error('No se encontró la información del proveedor');
        navigate(-1);
        return;
      }

      // Validar y normalizar la disponibilidad
      const disponibilidadValidada = dataProveedor.availability?.map(dia => ({
        ...dia,
        day: dia.day.toLowerCase(),
        slots: Array.isArray(dia.slots) ? dia.slots.filter(slot => slot && typeof slot === 'string') : []
      })).filter(dia => dia.slots.length > 0);

      if (disponibilidadValidada.length === 0) {
        toast.warning('Este proveedor no tiene horarios disponibles actualmente');
      }

      dataProveedor.availability = disponibilidadValidada;
      setProveedor(dataProveedor);

      // Establecer la fecha actual como fecha inicial
      setSelectedDate(new Date());
    } catch (err) {
      console.error('Error al cargar proveedor:', err);
      toast.error(err.response?.data?.message || 'Error al cargar la información del proveedor');
      navigate(-1);
    }
  };
  useEffect(() => {
    if (!socket) return;
    console.log('🧪 socket conectado:', socket?.connected);
  }, [socket]);

  useEffect(() => {
    const obtenerHorarios = async () => {
      if (!selectedDate || !proveedor?._id) return;

      const fechaISO = selectedDate.toISOString().split('T')[0];
      try {
        const res = await axios.get(`${API_URL}/prestadores/${proveedor._id}/horarios-disponibles`, {
          params: { fecha: fechaISO }
        });
        const { data } = res.data;
        setHorariosDelBackend(data || []);
      } catch (error) {
        console.error('Error al obtener horarios disponibles:', error);
        toast.error('No se pudieron cargar los horarios disponibles para esta fecha.');
        setHorariosDelBackend([]);
      }
    };

    obtenerHorarios();
  }, [selectedDate, proveedor]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Debes iniciar sesión para ver los detalles del proveedor');
      navigate('/login');
      return;
    }

    fetchProveedor();
    cargarReservas();

    // Cargar mascotas
    axios.get(`${API_URL}/pets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.length === 0) {
          toast.warning('No tienes mascotas registradas. Registra una mascota para poder hacer reservas.');
        }
        setMisMascotas(res.data);
      })
      .catch(err => {
        console.error('Error al cargar mascotas:', err);
        toast.error('No se pudieron cargar tus mascotas. Por favor, intenta nuevamente.');
      });
  }, [id, location.state, navigate]);


  const getDiaSemana = (fecha) => {
    if (!fecha || !(fecha instanceof Date) || isNaN(fecha)) return null;
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[fecha.getDay()];
  };

  const confirmarReserva = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
      navigate('/login');
      return;
    }

    // Validaciones individuales
    const validaciones = [];

    if (!selectedDate) {
      validaciones.push("fecha");
    }
    if (!selectedTime) {
      validaciones.push("horario");
    }
    if (!mascotaSeleccionada) {
      validaciones.push("mascota");
    }

    if (validaciones.length > 0) {
      toast.warning(`Por favor selecciona ${validaciones.join(", ")} para continuar`);
      return;
    }

    if (misMascotas.length === 0) {
      toast.warning('Necesitas registrar una mascota antes de poder hacer una reserva');
      navigate('/registromascota');
      return;
    }

    const fechaISO = selectedDate.toISOString().split('T')[0];

    // Verificar nuevamente si el horario sigue disponible
    if (!horariosDelBackend.includes(selectedTime)) {
      toast.error("Este horario ya no está disponible.");
      setSelectedTime(null);
      return;
    }

    setIsLoading(true);

    try {
      const resReserva = await axios.post(
        `${API_URL}/reservas`,
        {
          provider: proveedor._id,
          pet: mascotaSeleccionada,
          date: fechaISO,
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resReserva.status === 201) {
        if (socket && socket.connected) {
          socket?.emit('reservaRealizada', {
            proveedorId: proveedor._id, // <- corregido con populate
            userId, // <- obtenido del localStorage
            reservaId: resReserva.data._id,
            fecha: fechaISO,
            hora: selectedTime,
            mascota: misMascotas.find(p => p._id === mascotaSeleccionada)?.name || 'Mascota',
          });
          console.log('📤 Evento emitido reservaRealizada');
        } else {
          console.warn('⚠️ Socket no disponible o no conectado, no se pudo emitir evento');
        }
        try {
          await cargarReservas();

          // Resetear selecciones
          setSelectedTime(null);
          setMascotaSeleccionada('');
          setSelectedDate(new Date());

          toast.success(`✅ Reserva confirmada con ${proveedor.name} el ${selectedDate.toLocaleDateString('es-AR')} a las ${selectedTime}`);
          navigate('/inicio'); // Redirige a la página de inicio después de reservar
          setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 300);
        } catch (error) {
          console.error('Error al actualizar reservas:', error);
        }
      }
    } catch (err) {
      console.error('Error al reservar:', err);
      if (err.response?.status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        toast.error('El proveedor o la mascota seleccionada no fueron encontrados');
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message || 'Datos de reserva inválidos');
      } else {
        toast.error('Ocurrió un error al realizar la reserva. Por favor, intenta nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar estrellas solo lectura
  function ReadOnlyStars({ rating }) {
    return (
      <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? 'star filled' : 'star'}
            style={{ fontSize: '1.3em', color: star <= Math.round(rating) ? '#f5b50a' : '#ccc' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  if (!proveedor) return <p style={{ padding: "1rem" }}>Cargando proveedor...</p>;

  return (
    <div className="fb-proveedor-main" style={{ color: '#875e39', background: '#fdefce', minHeight: '100vh', position: 'relative' }}>
      {/* Flecha de volver */}
      <button
        className="back-button"
        style={{ position: 'absolute', top: 24, left: 24, fontSize: 32, color: '#875e39', zIndex: 1000 }}
        onClick={() => navigate(-1)}
        aria-label="Volver"
      >
        &larr;
      </button>
      {/* Banda superior crema */}
      <div className="fb-proveedor-cover" style={{ background: '#fdefce', height: 110, width: '100%' }}></div>
      {/* Avatar centrado sobresaliendo */}
      <div className="fb-proveedor-avatar-outer">
        <div className="fb-proveedor-avatar-box">
          <img src={proveedor.profileImage} alt={proveedor.name} className="fb-proveedor-avatar" />
        </div>
      </div>
      {/* Header info centrado */}
      <div className="fb-proveedor-header-info" style={{ textAlign: 'center', marginTop: 10 }}>
        <h1 className="fb-proveedor-nombre" style={{ color: '#000', fontSize: '2.5rem', margin: '0.5em 0 0.2em 0' }}>{proveedor.name}</h1>
        <div className="fb-proveedor-rating-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 6 }}>
          <ReadOnlyStars rating={proveedor.rating?.average || 0} />
          <span className="fb-proveedor-rating-num" style={{ color: '#a57449', fontWeight: 600, fontSize: '1.1em' }}>({formatRating(proveedor.rating?.average)})</span>
          {isDesktop && (
            <button className="ver-reseñas-btn" onClick={() => setShowReviewsModal(true)}>
              Ver reseñas
            </button>
          )}
        </div>
        <div className="fb-proveedor-subinfo" style={{ color: '#a57449', fontSize: '1.1em', marginBottom: 18 }}>
          {upper(proveedor.services?.map(s => s.type).join(', '))} · {proveedor.location?.address ?? 'Ubicación N/D'} · ${proveedor.services?.[0]?.price ?? 'N/A'}
        </div>
      </div>
      {/* Tabs visuales */}
      {/* <div className="fb-proveedor-tabs" style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '18px 0 28px 0' }}>
        <a href="#fb-sobre" className="fb-tab">Sobre</a>
        <a href="#fb-fotos" className="fb-tab">Fotos</a>
        <a href="#fb-reseñas" className="fb-tab">Reseñas</a>
        <a href="#fb-reunion" className="fb-tab">Programar reunión</a>
      </div> */}
      <div className="fb-proveedor-content" style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>
        {/* Servicios ofrecidos */}
        <div id="fb-sobre" className="fb-proveedor-section" style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#875e39' }}>Servicios ofrecidos</h2>
          {proveedor.description && <p>{proveedor.description}</p>}
          <ul>
            {proveedor.services?.map((s, idx) => (
              <li key={idx}><strong>{upper(s.type)}</strong>: {s.description}</li>
            ))}
          </ul>
        </div>
        {/* Reseñas */}
        <div id="fb-reseñas" className="fb-proveedor-section" style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#875e39' }}>Reseñas</h2>
          {isDesktop ? (
            <button className="ver-reseñas-btn" onClick={() => setShowReviewsModal(true)}>
              Ver todas las reseñas
            </button>
          ) : <ComentariosProveedor providerId={proveedor?._id} />}
        </div>
        {/* Programar reunión */}
        <div id="fb-reunion" className="fb-proveedor-section" style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#875e39' }}>Programar reunión</h2>
          <div className="fb-reunion-form" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-end', flexDirection: 'column', maxWidth: 350, margin: '0 auto' }}>
            {/* Fecha primero (azul) */}
            <div style={{ width: '100%' }}>
              <label style={{ color: '#a57449', fontWeight: 600, fontSize: '1.1em' }}>Fecha:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (date instanceof Date && !isNaN(date)) {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }
                }}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona una fecha"
                className="date-picker-input"
                locale="es"
                showPopperArrow={false}
                isClearable
                onSelect={(date) => {
                  if (date instanceof Date && !isNaN(date)) {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }
                }}
                style={{ width: '100%' }}
              />
            </div>
            {/* Hora label (naranja) */}
            <div style={{ width: '100%', marginTop: 18 }}>
              <label style={{ color: '#a57449', fontWeight: 600, fontSize: '1.1em' }}>Hora:</label>
            </div>
            {/* Horarios (rojo) */}
            {horariosDelBackend.length > 0 ? (
              horariosDelBackend.map((time) => (
                <button
                  key={time}
                  className={`time-button ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => setSelectedTime(time)}
                  style={{ width: '100%' }}
                >
                  {time}
                </button>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                {selectedDate ? 'No hay horarios disponibles para este día' : 'Selecciona una fecha para ver los horarios disponibles'}
              </p>
            )}

            {/* Mascota y acciones igual */}
            <div style={{ width: '100%', marginTop: 18 }}>
              <label style={{ color: '#a57449' }}>Mascota:</label>
              <div className="pet-thumbnails">
                {misMascotas.map((pet) => (
                  <div
                    key={pet._id}
                    className={`pet-thumb ${mascotaSeleccionada === pet._id ? 'selected' : ''}`}
                    onClick={() => setMascotaSeleccionada(pet._id)}
                    title={pet.name}
                  >
                    <img
                      src={pet.image || 'https://via.placeholder.com/80'}
                      alt={pet.name}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="fb-reunion-actions" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <button
                className="location-button"
                onClick={() => toast.info("Mostrando ubicación...")}
              >
                📍 Ver ubicación
              </button>
              <button
                className="book-button"
                onClick={abrirResumenReserva}
                disabled={isLoading}
              >
                {isLoading ? 'Reservando...' : 'Reservar ahora'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de reseñas solo en desktop */}
      {isDesktop && showReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, width: '90vw', maxHeight: '80vh', overflowY: 'auto' }}>
            <button className="close-btn" onClick={() => setShowReviewsModal(false)}>&times;</button>
            <ComentariosProveedor providerId={proveedor?._id} />
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 400,
              width: '90vw',
              padding: 24,
              backgroundColor: 'white',
              borderRadius: 12,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ color: '#875e39' }}>Confirmar reserva</h3>
            <p><strong>Proveedor:</strong> {proveedor.name}</p>
            <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-AR')}</p>
            <p><strong>Hora:</strong> {selectedTime}</p>
            <p><strong>Mascota:</strong> {misMascotas.find(p => p._id === mascotaSeleccionada)?.name}</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  confirmarReserva();
                }}
                className="book-button"
                style={{ backgroundColor: '#875e39', color: 'white' }}
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="location-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservar;
