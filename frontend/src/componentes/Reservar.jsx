import React, { useEffect, useState } from "react";
import formatRating from '../utils/formatRating';
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import '../estilos/Reservar.css';
import { toast } from 'react-toastify';

registerLocale('es', es);

const API_URL = import.meta.env.VITE_API_URL;

const Reservar = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const [proveedor, setProveedor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservas, setReservas] = useState([]);

  function upper(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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

  const fetchProveedor = async () => {
    try {
      let dataProveedor;

      if (location.state?.provider) {
        dataProveedor = location.state.provider;
      } else {
        const res = await axios.get(`${API_URL}/prestadores/${id}`);
        if (!res.data.success) {
          throw new Error('No se pudo obtener la información del proveedor');
        }
        dataProveedor = res.data.data;
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

  const isHorarioDisponible = (dia, horario) => {
    if (!proveedor?._id || !dia || !horario) return false;
    return !reservas.some(reserva =>
      reserva?.provider?._id === proveedor._id &&
      reserva?.date?.toLowerCase() === dia.toLowerCase() &&
      reserva?.time === horario
    );
  };

  const getDiaSemana = (fecha) => {
    if (!fecha || !(fecha instanceof Date) || isNaN(fecha)) return null;
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return dias[fecha.getDay()];
  };

  const getHorariosDisponibles = () => {
    if (!selectedDate || !proveedor?.availability) return [];

    const diaSeleccionado = getDiaSemana(selectedDate);
    if (!diaSeleccionado) return [];

    const diaDisponible = proveedor.availability.find(d =>
      d.day.toLowerCase() === diaSeleccionado.toLowerCase()
    );

    if (!diaDisponible) return [];

    return diaDisponible.slots.filter(slot => 
      isHorarioDisponible(diaSeleccionado, slot)
    );
  };

  const handleBook = async () => {
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

    const diaSeleccionado = getDiaSemana(selectedDate).toLowerCase();

    // Verificar nuevamente si el horario sigue disponible
    if (!isHorarioDisponible(diaSeleccionado, selectedTime)) {
      toast.error("Este horario ya no está disponible. Por favor selecciona otro.");
      const nuevosHorarios = getHorariosDisponibles();
      if (nuevosHorarios.length === 0) {
        toast.info("No hay más horarios disponibles para este día");
        setSelectedDate(null);
      }
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
          date: diaSeleccionado,
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resReserva.status === 201) {
        try {
          // Actualizar la disponibilidad en el backend
          await axios.put(
            `${API_URL}/prestadores/${proveedor._id}/availability`,
            { day: diaSeleccionado, slot: selectedTime },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // Actualizar las reservas locales
          await cargarReservas();

          // Actualizar la disponibilidad local
          const nuevaDisponibilidad = proveedor.availability
            .map(a => {
              if (a.day.toLowerCase() === diaSeleccionado) {
                const nuevosSlots = a.slots.filter(h => h !== selectedTime);
                return nuevosSlots.length > 0 ? { ...a, slots: nuevosSlots } : null;
              }
              return a;
            })
            .filter(Boolean);

          setProveedor(prevState => ({
            ...prevState,
            availability: nuevaDisponibilidad
          }));

          // Resetear selecciones
          setSelectedTime(null);
          setMascotaSeleccionada('');
          setSelectedDate(null);

          toast.success(`✅ Reserva confirmada con ${proveedor.name} el ${diaSeleccionado} a las ${selectedTime}`);
        } catch (error) {
          console.error('Error al actualizar disponibilidad:', error);
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

  if (!proveedor) return <p style={{ padding: "1rem" }}>Cargando proveedor...</p>;

  const horariosDisponibles = getHorariosDisponibles();

  return (
    <div className="profile-container" style={{ color: 'black' }}>
      <div className="reservaHeader">
        <button
          className="back-button"
          onClick={() => {
            if (location.state?.from && location.state.from.startsWith('/proveedores')) {
              navigate(location.state.from, {
                replace: true,
                state: {
                  selectedCategory: location.state.selectedCategory,
                  orderPrice: location.state.orderPrice
                }
              });
            } else if (from === 'inicio') {
              navigate('/inicio');
            } else {
              navigate('/proveedores');
            }
          }}
        >
          &larr;
        </button>
        <h2 className="section-title">Perfil Proveedor</h2>
      </div>

      <div className="image-container">
        <img
          src={proveedor.profileImage}
          alt={proveedor.name}
          className="walker-image"
        />
      </div>

      <div className="profile-content">
        <h3 className="walker-name">{proveedor.name}</h3>
        <p className="walker-role">{upper(proveedor.services?.map(s => s.type).join(', '))}</p>

        <div className="info-cards">
          <div className="info-card">
            <p className="info-main">{formatRating(proveedor.rating?.average)}</p>
            <p className="info-label">Rating</p>
          </div>
          <div className="info-card">
            <p className="info-main">${proveedor.services?.[0]?.price ?? 'N/A'}</p>
            <p className="info-label">Desde</p>
          </div>
          <div className="info-card">
            <p className="info-main">📍 {proveedor.location?.address ?? 'N/A'}</p>
            <p className="info-label">Ubicación</p>
          </div>
        </div>

        <div className="about-section">
          <h4>Sobre {proveedor.name}</h4>
          <p>Servicios ofrecidos:</p>
          <ul>
            {proveedor.services?.map((s, idx) => (
              <li key={idx}><strong>{upper(s.type)}</strong>: {s.description}</li>
            ))}
          </ul>
        </div>

        <div className="availability">
          <h4>Selecciona una fecha</h4>
          <div className="calendar-container">
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
            />
          </div>

          <h4>Horarios disponibles</h4>
          <div className="times">
            {horariosDisponibles.length > 0 ? (
              horariosDisponibles.map((time) => (
                <button
                  key={time}
                  className={`time-button ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => setSelectedTime(time)}
                  disabled={!selectedDate || !isHorarioDisponible(getDiaSemana(selectedDate), time)}
                >
                  {time}
                </button>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
                {selectedDate ? 'No hay horarios disponibles para este día' : 'Selecciona una fecha para ver los horarios disponibles'}
              </p>
            )}
          </div>
        </div>

        <div className="pet-selector">
          <label>Selecciona tu mascota:</label>
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

        <div className="buttons">
          <button
            className="location-button"
            onClick={() => toast.info("Mostrando ubicación...")}
          >
            📍 Ver ubicación
          </button>

          <button
            className="book-button"
            onClick={handleBook}
            disabled={isLoading}
          >
            {isLoading ? 'Reservando...' : 'Reservar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservar;
