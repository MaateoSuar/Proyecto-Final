import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderUsuario() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const BACK_URL = import.meta.env.VITE_BACK_URL;

  const handleClick = () => navigate("/profile");

  // ✅ Cargar el nombre al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
  
      fetch(`${API_URL}/auth/perfil`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            name: data.fullName || "",
            image: data.profileImage || null,
          });
          
        })
        .catch((err) => console.error("Error al obtener perfil:", err));
  }, []);

  return (
    <div className="header">
      <div className="avatar" onClick={handleClick}>
        {user.image ? (
          <img src={user.image} alt="Avatar" className="avatar-img" />
        ) : (
          <span>+</span>
        )}
      </div>
      <div className="greeting">
        <div className="name">Hola{user.name ? `, ${user.name}` : ""}</div>
        <div className="subtext">¡Buenos días!</div>
      </div>
    </div>
  );
}
