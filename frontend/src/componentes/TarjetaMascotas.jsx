import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TarjetaMascotas() {
  const API_URL = import.meta.env.VITE_API_URL;
  const BACK_URL = import.meta.env.VITE_BACK_URL;
  const [mascotas, setMascotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMascotas(res.data);
      } catch (err) {
        console.error("Error al traer mascotas:", err);
      }
    };
    fetchMascotas();
  }, []);

  return (
    <div className="pets-box">
      <div className="pets">
        {mascotas.map((mascota) => (
          <div
            key={mascota._id}
            className="pet-img"
            style={{ backgroundImage: `url(${BACK_URL}${mascota.image})` }}
            title={mascota.name}
          ></div>
        ))}

        <div className="pet-add" onClick={() => navigate("/registromascota")}>
          +
        </div>
      </div>
    </div>
  );
}
