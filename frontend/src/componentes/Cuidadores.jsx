import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUbicacion } from '../context/UbicacionContext';

const API_URL = import.meta.env.VITE_API_URL;

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // en km
}

export default function Cuidadores() {
  const navigate = useNavigate();
  const { ubicacionActual } = useUbicacion();
  const [cuidadores, setCuidadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarSelector, setMostrarSelector] = useState(false);

  useEffect(() => {
    if (!ubicacionActual || !ubicacionActual.coordenadas) {
      setCuidadores([]);
      setLoading(false);
      return;
    }
    const fetchCuidadores = async () => {
      setLoading(true);
      try {
        const userLat = ubicacionActual.coordenadas.lat;
        const userLng = ubicacionActual.coordenadas.lng;
        const res = await axios.get(`${API_URL}/prestadores`);
        if (res.data.success) {
          const activos = res.data.data.filter(p => p.isActive && p.location && p.location.coordinates && Array.isArray(p.location.coordinates.coordinates));
          const conDistancia = activos.map(p => {
            const [lat, lng] = p.location.coordinates.coordinates;
            const distancia = calcularDistancia(userLat, userLng, lat, lng);
            return { ...p, distancia };
          });
          conDistancia.sort((a, b) => a.distancia - b.distancia);
          // Filtrar solo los que están a menos de 25km
          const cercanos = conDistancia.filter(p => p.distancia < 25).slice(0, 3);
          setCuidadores(cercanos);
        } else {
          setCuidadores([]);
        }
      } catch (error) {
        setCuidadores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCuidadores();
  }, [ubicacionActual]);

  const irADetalleProveedor = (cuidador) => {
    let categoria = cuidador.services && cuidador.services[0] ? cuidador.services[0].type : '';
    navigate(`/proveedor/${cuidador._id}?categoria=${categoria}`, {
      state: { provider: cuidador }
    });
  };

  // Si no hay ubicación seleccionada
  if (!ubicacionActual || !ubicacionActual.coordenadas) {
    return (
      <div style={{ textAlign: 'center', margin: '2em 0' }}>
        <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 18 }}>
          No hay una ubicación seleccionada
        </div>
        <button
          style={{
            background: '#875e39',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
          onClick={() => {
            // Emitir evento para abrir el modal de SelectorUbicacion
            window.dispatchEvent(new CustomEvent('abrirSelectorUbicacion'));
          }}
        >
          Seleccionar Ubicación
        </button>
      </div>
    );
  }

  if (loading) return <div>Cargando cuidadores cercanos...</div>;
  if (cuidadores.length === 0) return <div>No hay cuidadores cercanos disponibles.</div>;

  return (
    <div className="care-card">
      {cuidadores.map(cuidador => (
        <div
          className="care-person"
          key={cuidador._id}
          onClick={() => irADetalleProveedor(cuidador)}
        >
          <div
            className="care-avatar"
            style={{ backgroundImage: `url('${cuidador.profileImage || "/img/enzo.png"}')` }}
          ></div>
          <div className="care-info">
            <div className="name">{cuidador.name}</div>
            <div>
              ⭐ {cuidador.rating?.average?.toFixed(1) || "-"} • {cuidador.services && cuidador.services[0] ? `$${cuidador.services[0].price}/h` : "-"} • {cuidador.distancia.toFixed(1)} km
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

