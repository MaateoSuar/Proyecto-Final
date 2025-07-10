// src/componentes/ChatReserva.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../estilos/chatReserva.css';

const API_URL = import.meta.env.VITE_API_URL;

const ChatReserva = ({ reservaId, onClose }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [nombrePrestador, setNombrePrestador] = useState('');

    const obtenerNombrePrestador = async () => {
        const token = localStorage.getItem('token');
        try {
            // Paso 1: obtener la reserva
            const resReserva = await axios.get(`${API_URL}/reservas/${reservaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const prestadorId = resReserva.data.provider;

            // Paso 2: obtener el prestador
            const resPrestador = await axios.get(`${API_URL}/prestadores/${prestadorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const nombre = resPrestador.data.data?.name;
            setNombrePrestador(nombre || 'el prestador');

        } catch (error) {
            console.error('Error al obtener el nombre del prestador:', error);
        }
    };

    const cargarMensajes = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`${API_URL}/chat/mensajes/${reservaId}`, {
                headers: { Authorization: `Bearer ${token}` }
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
                mensaje: nuevoMensaje
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNuevoMensaje('');
            cargarMensajes();
        } catch (error) {
            console.error('Error al enviar mensaje', error);
        }
    };

    useEffect(() => {
        cargarMensajes();
        obtenerNombrePrestador();
    }, [reservaId]);

    return (
        <div className="chat-reserva">
            <div className="chat-header">
                <h4>{nombrePrestador}</h4>
                <p className='cerrar-chat' onClick={onClose}>x</p>
            </div>
            <div className="chat-mensajes">
                {mensajes.map((msg, i) => (
                    <div
                        key={i}
                        className={`mensaje ${msg.emisorTipo === 'Usuario' ? 'mensaje-usuario' : 'mensaje-prestador'}`}
                    >
                        <div className="mensaje-contenido">
                            {msg.mensaje}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={e => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    autoComplete='off'
                />
                <button onClick={enviarMensaje}>Enviar</button>
            </div>
        </div>
    );
};

export default ChatReserva;
