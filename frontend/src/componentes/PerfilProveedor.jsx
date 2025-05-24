import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../estilos/perfilproveedor.css';

const API_URL = import.meta.env.VITE_API_URL;

const PerfilProveedor = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');


  function upper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (location.state?.provider) {
      setProveedor(location.state.provider);
    } else {
      axios.get(`${API_URL}/prestadores/${id}`)
        .then(res => {
          if (res.data.success) setProveedor(res.data.data);
        })
        .catch(err => console.error('Error al cargar proveedor', err));
    }

    const fetchProveedor = async () => {
      try {
        let dataProveedor;

        if (location.state?.provider) {
          dataProveedor = location.state.provider;
        } else {
          const res = await axios.get(`${API_URL}/prestadores/${id}`);
          if (res.data.success) {
            dataProveedor = res.data.data;
          }
        }

        if (dataProveedor) {
          setProveedor(dataProveedor);

          // Establecer selectedDay automáticamente si hay disponibilidad
          const diasOrdenados = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
          const diasDisponibles = dataProveedor.availability?.map(d => d.day.toLowerCase());

          const primerDiaDisponible = diasOrdenados.find(dia => diasDisponibles.includes(dia));
          if (primerDiaDisponible) setSelectedDay(primerDiaDisponible);
        }
      } catch (err) {
        console.error('Error al cargar proveedor', err);
      }
    };

    fetchProveedor();

    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/pets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setMisMascotas(res.data))
        .catch(err => console.error('Error al cargar mascotas', err));
    }
  }, [id, location.state]);

  const handleBook = async () => {
    if (!selectedDay || !selectedTime || !mascotaSeleccionada) {
      alert("Por favor selecciona un día, hora y una mascota.");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const resReserva = await axios.post(
        `${API_URL}/reservas`,
        {
          provider: proveedor._id,
          pet: mascotaSeleccionada, // ✅ Aquí va el ID de la mascota seleccionada
          date: selectedDay,
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (resReserva.status === 201) {
        alert(`✅ Reserva confirmada con ${proveedor.name} el ${selectedDay} a las ${selectedTime}.`);

        const resDisponibilidad = await axios.put(
          `${API_URL}/prestadores/${proveedor._id}/availability`,
          { day: selectedDay, slot: selectedTime },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(resDisponibilidad);

        if (resDisponibilidad.data.success) {
          const nuevaDisponibilidad = proveedor.availability.map(a =>
            a.day === selectedDay
              ? { ...a, slots: a.slots.filter(h => h !== selectedTime) }
              : a
          );

          setProveedor({ ...proveedor, availability: nuevaDisponibilidad });
          setSelectedDay(null);
          setSelectedTime(null);
          setMascotaSeleccionada(''); // limpiar selección
        }
      }
    } catch (err) {
      console.error('Error al reservar:', err);
      console.error('Error al reservar:', err.response?.data || err.message);
      alert('❌ Ocurrió un error al reservar. Intenta nuevamente.');
    }
  };



  if (!proveedor) return <p style={{ padding: "1rem" }}>Cargando proveedor...</p>;

  return (
    <div className="profile-container" style={{ color: 'black' }}>
      {/* ... Aquí puedes reemplazar proveedorData con proveedor */}
      <div className="header">
        <button
          className="back-button"
          onClick={() => {
            if (location.state?.from) {
              navigate(location.state.from, {
                replace: true,
                state: {
                  selectedCategory: location.state.selectedCategory,
                  orderPrice: location.state.orderPrice
                }
              });
            } else {
              navigate(-1);
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
            <p className="info-main">{proveedor.rating?.average ?? 'N/A'}</p>
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
          <h4>Días disponibles</h4>
          <div className="days">
            {proveedor.availability?.map((a) => (
              <button
                key={a.day}
                className={`day-button ${selectedDay === a.day ? "selected" : ""}`}
                onClick={() => {
                  setSelectedDay(a.day);
                  setSelectedTime(null);
                }}
              >
                {a.day}
              </button>
            ))}
          </div>

          <h4>Horarios disponibles</h4>
          <div className="times">
            {proveedor.availability
              ?.find(d => d.day === selectedDay)
              ?.slots.map((time) => (
                <button
                  key={time}
                  className={`time-button ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
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
            onClick={() => alert("Mostrando ubicación...")}
          >
            📍 Ver ubicación
          </button>

          <button className="book-button" onClick={handleBook}>
            Reservar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilProveedor;
