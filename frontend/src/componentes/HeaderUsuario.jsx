import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderUsuario() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");

  const handleClick = () => navigate("/profile");

  // ✅ Cargar el nombre al montar el componente
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("usuario"));
    if (stored?.fullName) {
      setNombre(stored.fullName);
    }
  }, []);

  return (
    <div className="header">
      <div className="avatar" onClick={handleClick}></div>
      <div className="greeting">
        <div className="name">Hola{nombre ? `, ${nombre}` : ""}</div>
        <div className="subtext">¡Buenos días!</div>
      </div>
    </div>
  );
}
