import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import '../estilos/chatReserva.css';

const API_URL = import.meta.env.VITE_API_URL;
const BACK_URL = import.meta.env.VITE_BACK_URL;

const ChatReserva = ({ reservaId, onClose, socket }) => {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [nombrePrestador, setNombrePrestador] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');

  const mensajesEndRef = useRef(null);
  const socketRef = useRef(null);

  const usuario = localStorage.getItem('usuario');

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const obtenerNombrePrestador = async () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    try {
      const resReserva = await axios.get(`${API_URL}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const prestadorId = resReserva.data.provider;

      const resPrestador = await axios.get(`${API_URL}/prestadores/${prestadorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nombre = resPrestador.data.data?.name;
      setNombrePrestador(nombre || 'el prestador');

    } catch (error) {
      console.error('Error al obtener el nombre del prestador:', error);
    }
  };

  const obtenerNombreUsuario = async () => {
    const token = localStorage.getItem('token');
    try {
      const resReserva = await axios.get(`${API_URL}/reservas/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuarioId = resReserva.data.user;

      const resUsuario = await axios.get(`${API_URL}/auth/usuarios/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nombre = resUsuario.data.data?.fullName;
      setNombreUsuario(nombre || 'el usuario');

    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
    }
  };

  const cargarMensajes = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${API_URL}/chat/mensajes/${reservaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensajes(res.data);
    } catch (error) {
      console.error('Error al cargar mensajes', error);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/chat/mensaje`, {
        reservaId,
        mensaje: nuevoMensaje,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNuevoMensaje('');
      cargarMensajes();
    } catch (error) {
      console.error('Error al enviar mensaje', error);
    }
  };

  useEffect(() => {
    cargarMensajes();
    obtenerNombreUsuario();
    obtenerNombrePrestador();
  }, [reservaId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    
    if (!socket) return;

    const userId = JSON.parse(localStorage.getItem('usuario'))?.id || JSON.parse(localStorage.getItem('prestador'))?.id;

    socket.emit('joinSala', userId);

    const handler = (nuevo) => {
      if (nuevo.reservaId === reservaId) {
        setMensajes(prev => {
          if (prev.some(m => m._id === nuevo._id)) return prev;
          return [...prev, nuevo];
        });
      }
    };

    socket.on('mensajeRecibido', handler);

    return () => {
      socket.off('mensajeRecibido', handler);
    };
  }, [reservaId, socket]);

  return (
    <div className="chat-reserva">
      <div className="chat-header">
        <h4>{usuario ? nombrePrestador : nombreUsuario}</h4>
        <p className="cerrar-chat" onClick={onClose}>x</p>
      </div>
      <div className="chat-mensajes">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`mensaje ${usuario ? (msg.emisorTipo === 'Usuario' ? 'mensaje-usuario' : 'mensaje-prestador') : (msg.emisorTipo === 'Usuario' ? 'mensaje-prestador' : 'mensaje-usuario')}`}
          >
            <div className="mensaje-contenido">
              {msg.mensaje}
            </div>
          </div>
        ))}
        <div ref={mensajesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
          autoComplete="off"
        />
        <button onClick={enviarMensaje}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatReserva;
