// src/paginas/PaginaHomePrestador.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import HeaderPrestador from '../componentes/HeaderPrestador';
import MisReservas from '../componentes/MisReservas';
import CalendarioReservas from '../componentes/CalendarioReservas';
import '../estilos/home/index.css';

const API_URL = import.meta.env.VITE_API_URL;
const BACK_URL = import.meta.env.VITE_BACK_URL;

export default function PaginaHome() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('prestador')).id; // Asegurate de guardar el userId en el login

    if (!userId || !token) return;

    // 1. Conectamos al socket con el token como query
    const newSocket = io(`${BACK_URL}`, {
      auth: { token },
    });
    window.socket = newSocket; // Para depuración

    // 2. Unirse a la sala del usuario (backend escucha esto)
    newSocket.emit('joinSala', userId);

    // 3. Escuchamos el evento de nuevo mensaje
    newSocket.on('mensajeRecibido', (mensaje) => {
      setNotificaciones(prev => [...prev, mensaje]);
    });

    setSocket(newSocket);

    // Cleanup al desmontar
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const irAProgramarDisponibilidad = () => {
    navigate('/cuidador/programar-disponibilidad');
  };

  return (
    <div className="pagina-home">
      <div className="header-container">
        <HeaderPrestador />
      </div>
      <div className='content-container'>
        <div className="dashboard-grid">
          <div className="dashboard-section">
            {socket && <MisReservas />}
          </div>
          <div className="dashboard-section">
            <CalendarioReservas />
            <button 
                className="btn-programar-disponibilidad"
                onClick={irAProgramarDisponibilidad}
              >
                Programar Disponibilidad
              </button>
          </div>
          <div className="dashboard-section">
          </div>
        </div>
      </div>
      <div className="footer">
        Amá a tus mascotas con PetCare <span>❤️</span>
      </div>
    </div>
  );
}
