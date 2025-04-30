import { useNavigate } from "react-router-dom";


export default function HeaderUsuario() {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate("/profile"); 
  };

  return (
    <div className="header">
      <div className="avatar" onClick={handleClick}></div>
      <div className="greeting">
        <div className="name">Hola</div>
        <div className="subtext">¡Buenos días!</div>
      </div>
    </div>
  );
}

