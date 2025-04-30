import { useNavigate } from "react-router-dom";


export default function HeaderUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || { nombre: "Usuario" };
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/profile"); 
  };

  return (
    <div className="header">
      <div className="avatar" onClick={handleClick}></div>
      <div className="greeting">
        <div className="name">Hola, {usuario.nombre}</div>
        <div className="subtext">¡Buenos días!</div>
      </div>
    </div>
  );
}

