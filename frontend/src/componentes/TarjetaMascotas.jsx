import { useNavigate } from "react-router-dom";

export default function TarjetaMascotas() {
  const navigate = useNavigate();

  return (
    <div className="pets-box">
      <div className="pets">
        <div className="pet-add" onClick={() => navigate('/registromascota')}>+</div>
      </div>
    </div>
  );
}
