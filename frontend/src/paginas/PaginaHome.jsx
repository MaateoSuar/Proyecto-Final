// src/paginas/PaginaHome.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import HeaderUsuario from '../componentes/HeaderUsuario';
import TarjetaMascotas from '../componentes/TarjetaMascotas';
import Servicios from '../componentes/Servicios';
import Planes from '../componentes/Planes';
import { useMediaQuery } from 'react-responsive';
import Cuidadores from '../componentes/Cuidadores';
import HistorialReservasHome from '../componentes/HistorialReservasHome';
import SelectorUbicacion from '../componentes/SelectorUbicacion';
import Notificaciones from '../componentes/Notificaciones';
import BotonVolver from '../componentes/BotonVolver';
import '../estilos/home/index.css';

const API_URL = import.meta.env.VITE_API_URL;
const BACK_URL = import.meta.env.VITE_BACK_URL;

export default function PaginaHome() {
  const isMobile = useMediaQuery({ maxWidth: 680 });
  const [notificaciones, setNotificaciones] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('usuario') && JSON.parse(localStorage.getItem('usuario')).id; // Asegurate de guardar el userId en el login
    if (!userId || !token) return;

    // 1. Conectamos al socket con el token como query
    const newSocket = io(`${BACK_URL}`, {
      auth: { token },
    });

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

  return (

    <div className="pagina-home">
      {isMobile ?
          <div className="header-container">
            <HeaderUsuario />
            <div className="right-box">
              <Notificaciones notificaciones={notificaciones} />
            </div>
          </div> :
        <div className="header-container">
          <HeaderUsuario />
          <div className="right-box">
            <div className="location-box">
              <SelectorUbicacion mobile={isMobile} />
            </div>
            <Notificaciones notificaciones={notificaciones} />
          </div>
        </div>
      }
      <div className="content-container">
        <div className="left-column">
          <TarjetaMascotas />
        </div>

        <div className="right-column">
          {isMobile && <SelectorUbicacion mobile={isMobile} />}
          <div className="pets-box">
            <h2 className="section-title">Tus mascotas</h2>
            <TarjetaMascotas />
          </div>

          <div className="services-box">
            <h2 className="section-title" style={{ marginBottom: '5px' }}>Servicios</h2>
            <Servicios />
          </div>

          <div className="plans-box" id='planes'>
            <h2 className="section-title">Planes recomendados</h2>
            <Planes />
          </div>

          <div className="plans-box">
            <h2 className="section-title">Reservas pendientes</h2>
            <HistorialReservasHome />
          </div>

          <div className="care-box">
            <h2 className="section-title">Cuidadores cercanos</h2>
            <Cuidadores />
          </div>

          <div className="footer">
            Amá a tus mascotas con PetCare <span>❤️</span>
          </div>
        </div>
      </div>
    </div>
  );
}
