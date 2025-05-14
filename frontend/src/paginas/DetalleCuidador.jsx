import { useLocation } from "react-router-dom";
import "../estilos/detallecuidador.css";


export default function DetalleCuidador() {
  const location = useLocation();
  const cuidador = location.state;

  if (!cuidador) return <p>No se encontró el cuidador</p>;

  return (
    <div className="detalle-cuidador">
      <div className="header">
        <h2>Cuidador de Perros</h2>
        <img src={cuidador.foto} alt="Foto cuidador" className="foto-perfil" />
      </div>

      <h3>{cuidador.nombre}</h3>
      <p>Cuidador de Perros</p>

      <div className="datos">
        <div><strong>Experiencia:</strong> {cuidador.experiencia}</div>
        <div><strong>Precio:</strong> {cuidador.precio}</div>
        <div><strong>Ubicación:</strong> {cuidador.distancia}</div>
      </div>

      <p className="descripcion">
        {cuidador.descripcion}
      </p>

      <button>Ver Ubicación</button>
      <button>Reservar Ahora</button>
    </div>
  );
}
