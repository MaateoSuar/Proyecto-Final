// src/componentes/ChatsPrestador.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatReserva from './ChatReserva'; // Usá el que ya tenés hecho
const API_URL = import.meta.env.VITE_API_URL;

const ChatsPrestador = () => {
  const [reservas, setReservas] = useState([]);
  const [chatAbierto, setChatAbierto] = useState(null);

  useEffect(() => {
    const cargarReservas = async () => {
      const prestadorData = JSON.parse(localStorage.getItem('prestador'));
      if (!prestadorData || !prestadorData.id) return;

      try {
        const res = await axios.get(`${API_URL}/reservas/provider/${prestadorData.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
        );
        setReservas(res.data);
      } catch (error) {
        console.error('Error al obtener reservas del prestador:', error);
      }
    };

    cargarReservas();
  }, []);

  return (
    <div className="chats-prestador">
      <h2>Chats de tus reservas</h2>

      {reservas.length === 0 ? (
        <p>No hay reservas asociadas.</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva._id}>
              <p><strong>Usuario:</strong> {reserva.user?.fullName || reserva.user?.email}</p>
              <p><strong>Mascota:</strong> {reserva.pet?.name}</p>
              <p><strong>Fecha:</strong> {new Date(reserva.date).toLocaleDateString()}</p>
              <button onClick={() => setChatAbierto(reserva._id)}>Abrir Chat</button>
            </li>
          ))}
        </ul>
      )}

      {chatAbierto && (
        <ChatReserva
          reservaId={chatAbierto}
          onClose={() => setChatAbierto(null)}
        />
      )}
    </div>
  );
};

export default ChatsPrestador;
