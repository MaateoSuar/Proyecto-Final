// src/componentes/CampanitaNotificaciones.jsx
import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import '../estilos/notificaciones.css'; // Estilos aparte opcional
import { useNavigate } from 'react-router-dom';

const Notificaciones = ({ notificaciones }) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible(prev => !prev);

  // dentro de Notificaciones
  const navigate = useNavigate();

  const irAlChat = (reservaId) => {
    navigate(`/profile?tab=reservas&chat=${reservaId}`);
  };

  return (
    <div className="campanita-wrapper">
      <div className="campanita-icon" onClick={toggle}>
        <FaBell />
        {notificaciones.length > 0 && <span className="badge">{notificaciones.length}</span>}
      </div>
      {visible && (
        <div className="panel-notificaciones">
          <h4>Notificaciones</h4>
          {notificaciones.length === 0 ? (
            <p>No hay notificaciones nuevas.</p>
          ) : (
            <ul>
              {notificaciones.map((n, i) => {
                const fecha = new Date(n.fecha);
                const hora = fecha.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                });
                return (
                  <li key={i} onClick={() => irAlChat(n.reservaId)} className="clickable-li">
                    <div className="linea-mensaje">
                      <span><b>{n.nombreEmisor}</b>: {n.mensaje}</span>
                      <span className="hora-mensaje">{hora}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
