import React, { useEffect, useState } from "react";
import "../estilos/HistorialReservas.css";

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error al obtener reservas", err));
  }, []);

  const cancelarReserva = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/reservas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Reserva cancelada");
        setReservas(reservas.filter((r) => r._id !== id));
      } else {
        alert(data.message || "Error al cancelar");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al cancelar la reserva");
    }
  };

  return (
    <div className="historial-contenedor">
      <h2>Mis Reservas</h2>
      {reservas.map((reserva) => (
        <div key={reserva._id} className="historial-reserva">
          <div className="historial-nombre">{reserva.pet.name}</div>
          <div className="historial-info">
            Con {reserva.provider.name} el {reserva.date} a las {reserva.time}
          </div>
          <button
            className="historial-btn"
            onClick={() => cancelarReserva(reserva._id)}
          >
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistorialReservas;
