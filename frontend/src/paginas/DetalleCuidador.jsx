import { useLocation } from "react-router-dom";
import "../estilos/detallecuidador.css";

export default function DetalleCuidador() {
  const location = useLocation();
  const cuidador = location.state?.provider;

  if (!cuidador) return <p>No se encontró el cuidador</p>;

  return (
    <div className="detalle-cuidador">
      <div className="header">
        <h2>Cuidador de Mascotas</h2>
        <img 
          src={cuidador.profileImage || '/img/default-avatar.png'} 
          alt="Foto cuidador" 
          className="foto-perfil" 
        />
      </div>

      <h3>{cuidador.name}</h3>
      <p>Cuidador de Mascotas</p>

      <div className="datos">
        <div><strong>Servicios:</strong> {cuidador.services?.map(s => s.type).join(', ') || 'No especificado'}</div>
        <div><strong>Precio promedio:</strong> ${cuidador.services?.[0]?.price || 'No especificado'}</div>
        <div><strong>Calificación:</strong> ⭐ {cuidador.rating?.average || 0}/5 ({cuidador.rating?.totalReviews || 0} reseñas)</div>
      </div>

      <p className="descripcion">
        {cuidador.description || 'Sin descripción disponible'}
      </p>

      <button>Ver Ubicación</button>
      <button>Reservar Ahora</button>
    </div>
  );
}
