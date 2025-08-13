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
import ReviewForm from "./ReviewForm";
import BotonVolver from './BotonVolver';


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
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 900 });
  const isMobile = useMediaQuery({ maxWidth: 711 });
  const isTablet = useMediaQuery({minWidth: 712})

  const comentarios = () =>{
    if (isDesktop) return 2;
    if (isTablet) return 3;
    if (isMobile && showAllReviews) return null;
    return 2;
  }

  const verComentarios = () => {
    if (isTablet) {
      setShowReviewsModal(true);
    } else if (isMobile && !showAllReviews) {
      setShowAllReviews(true);
    } else if (isMobile && showAllReviews) {
      setShowAllReviews(false);
    }
  }

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
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/prestadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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

      if (resReserva.status === 201 && socket && socket.connected) {
        try {
          socket?.emit('reservaRealizada', {
            proveedorId: proveedor._id, // <- corregido con populate
            userId, // <- obtenido del localStorage
            reservaId: resReserva.data._id,
            fecha: fechaISO,
            hora: selectedTime,
            mascota: misMascotas.find(p => p._id === mascotaSeleccionada)?.name || 'Mascota',
          });
        } catch (error) {
          console.error('Error al emitir evento de reserva:', error);
        }
        try {
          await cargarReservas();

          // Resetear selecciones
          setSelectedTime(null);
          setMascotaSeleccionada('');
          setSelectedDate(new Date());

          toast.success(`✅ Reserva confirmada con ${proveedor.name} el ${selectedDate.toLocaleDateString('es-AR')} a las ${selectedTime}`);
          
          // Redirigir a la página de prestadores después de confirmar la reserva
          setTimeout(() => {
            navigate('/proveedores');
          }, 1000);
        } catch (error) {
          console.error('Error al actualizar reservas:', error);
        }
      } else {
        console.warn('⚠️ Socket no disponible o no conectado, no se pudo emitir evento');
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
      setShowConfirmModal(false);
    }
  };

  // Función para mostrar estrellas solo lectura
  function ReadOnlyStars({ rating }) {
    return (
      <div className="reserva-stars">
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
    <div className="reservar-container">
      {/* Botón de volver para PC/tablet */}
      {!isMobile && (
        <button className="back-button" onClick={() => navigate(-1)}>&larr;</button>
      )}
      
      {/* Botón de volver responsive para móvil */}
      {isMobile && <BotonVolver />}

      <div className="reservar-main">
        {/* Columna izquierda - Perfil del proveedor */}
        <div className="columna-izquierda">
          <div className="perfil-proveedor">
            <div className="reserva-avatar-box">
              <img src={proveedor.profileImage} alt={proveedor.name} className="reserva-avatar" />
            </div>
            <h1 className="pres-nombre">{proveedor.name}</h1>
            <div className="rating-row">
              <ReadOnlyStars rating={proveedor.rating?.average || 0} />
              <span className="rating-num">({formatRating(proveedor.rating?.average)})</span>
            </div>
            <p className="subinfo">
              {upper(proveedor.services?.map(s => s.type).join(', '))} · {proveedor.location?.address ?? 'Ubicación N/D'} · ${proveedor.services?.[0]?.price ?? 'N/A'}
            </p>
            <div className="pres-descripcion">
              <h3>Sobre el proveedor</h3>
              <p>{proveedor.description}</p>
              <ul>
                {proveedor.services?.map((s, idx) => (
                  <li key={idx}><strong>{upper(s.type)}</strong>: {s.description}</li>
                ))}
              </ul>
              <h3 style={{ marginTop: '2rem', marginBottom: '0' }}>Comentarios</h3>
              <ComentariosProveedor providerId={proveedor?._id} cantidad={comentarios()} />
              <button className="ver-reseñas-btn" onClick={verComentarios}>
                {showAllReviews ? 'Ver menos' : 'Ver más'}
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Formulario de reserva */}
        <div className="columna-derecha">
          <div className="formulario-reserva">
            <h2>Programar reunión</h2>

            <label>Fecha:</label>
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
            />

            <label>Hora:</label>
            { horariosDelBackend.length === 0 && (<p>{selectedDate ? 'No hay horarios disponibles para este día' : 'Selecciona una fecha'}</p>)}
            <div className={`reserva-horarios ${isDesktop ? 'reserva-horarios-desktop' : ''} ${isMobile ? 'reserva-horarios-mobile' : ''}`}>
              {horariosDelBackend.length > 0 && (
                horariosDelBackend.map((time) => (
                  <button
                    key={time}
                    className={`reserva-time-button ${selectedTime === time ? "selected" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>

            <label>Mascota:</label>
            <div className="custom-pet-select">
              <div
                className="custom-select-trigger"
                onClick={() => setShowPetDropdown(prev => !prev)}
              >
                {mascotaSeleccionada ? (
                  <>
                    <img
                      src={misMascotas.find(p => p._id === mascotaSeleccionada)?.image || 'https://via.placeholder.com/80'}
                      alt="Seleccionada"
                      className="pet-preview-img"
                    />
                    <span>{misMascotas.find(p => p._id === mascotaSeleccionada)?.name}</span>
                  </>
                ) : (
                  <span className="placeholder">Selecciona una mascota</span>
                )}
              </div>

              {showPetDropdown && (
                <div className="custom-options">
                  {misMascotas.map((pet) => (
                    <div
                      key={pet._id}
                      className="custom-option"
                      onClick={() => {
                        setMascotaSeleccionada(pet._id);
                        setShowPetDropdown(false);
                      }}
                    >
                      <img
                        src={pet.image || null}
                        alt={pet.name}
                        className="pet-preview-img"
                      />
                      <span>{pet.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="reserva-acciones">
              <button className="book-button" onClick={abrirResumenReserva} disabled={isLoading}>
                {isLoading ? 'Reservando...' : 'Reservar ahora'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      { showReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowReviewsModal(false)}>&times;</button>
            <ComentariosProveedor providerId={proveedor?._id} />
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirmar reserva</h3>
            <p><strong>Proveedor:</strong> {proveedor.name}</p>
            <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString('es-AR')}</p>
            <p><strong>Hora:</strong> {selectedTime}</p>
            <p><strong>Mascota:</strong> {misMascotas.find(p => p._id === mascotaSeleccionada)?.name}</p>
            <div className="modal-actions">
              <button onClick={confirmarReserva} className="book-button">Confirmar</button>
              <button onClick={() => setShowConfirmModal(false)} className="location-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Reservar;
