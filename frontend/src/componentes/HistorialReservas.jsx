import React, { useEffect, useState } from "react";
import axios from "axios";
import "../estilos/HistorialReservas.css";
import { toast } from 'react-toastify';

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);

  function upper(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getReservas = () => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReservas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas:", error);
        toast.error(error.response?.data?.message || "Error al obtener las reservas");
      });
  }
  useEffect(() => {
    getReservas();
  }, []);

  const cancelarReserva = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`http://localhost:5000/api/reservas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Reserva cancelada exitosamente");
      setReservas(prev =>
        prev.map(r => r._id === id ? { ...r, status: "cancelada" } : r)
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al cancelar la reserva");
    }
  };

  return (
    <div className="historial-contenedor">
      <h2>Mis Reservas</h2>
      {reservas.map((reserva) => (
        <div key={reserva._id} className="historial-reserva">
          <div className="historial-nombre">{reserva.pet?.name || "Mascota desconocida"}</div>
          <div className="historial-info">
            Con {reserva.provider?.name || "Proveedor desconocido"} el {reserva.date} a las {reserva.time}
          </div>
          <div className="historial-status">
            Estado: {upper(reserva.status)}
          </div>
          {reserva.status === "pendiente" && (
            <button className="historial-btn" onClick={() => cancelarReserva(reserva._id)}>
              Cancelar
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistorialReservas;
