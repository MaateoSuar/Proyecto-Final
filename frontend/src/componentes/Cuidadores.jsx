import { useNavigate } from "react-router-dom";

export default function Cuidadores() {
  const navigate = useNavigate();

  const verDetalle = (cuidador) => {
    navigate("/detalle-cuidador", { state: cuidador });
  };

  return (
    <div className="care-box">
      <div className="care-card">
        {/* ENZO */}
        <div
          className="care-person"
          onClick={() =>
            verDetalle({
              nombre: "Enzo Fernandez",
              experiencia: "3 años",
              precio: "$2.500",
              distancia: "2.5 km",
              descripcion: "Enzo es un cuidador con 3 años de experiencia dedicado y apasionado por los perros.",
              foto: "/img/enzo.png",
            })
          }
        >
          <div
            className="care-avatar"
            style={{ backgroundImage: "url('/img/enzo.png')" }}
          ></div>
          <div className="care-info">
            <div className="name">Enzo Fernandez</div>
            <div>⭐ 4.7 • $2.500/h • Disponible mañana</div>
          </div>
        </div>

        {/* JUAN */}
        <div
          className="care-person"
          onClick={() =>
            verDetalle({
              nombre: "Juan Benedetti",
              experiencia: "2 años",
              precio: "$2.300",
              distancia: "3.0 km",
              descripcion: "Juan es un cuidador confiable con amor por los animales y experiencia comprobada.",
              foto: "/img/juanb.png",
            })
          }
        >
          <div
            className="care-avatar"
            style={{ backgroundImage: "url('/img/juanb.png')" }}
          ></div>
          <div className="care-info">
            <div className="name">Juan Benedetti</div>
            <div>⭐ 4.5 • $2.300/h • Disponible la próxima semana</div>
          </div>
        </div>
      </div>
    </div>
  );
}

  