import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TarjetaMascotas() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [mascotas, setMascotas] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMascotas(res.data);
        if (res.data.length > 0) {
          setSelectedPet(res.data[0]);
        }
      } catch (err) {
        console.error("Error al traer mascotas:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMascotas();
  }, [API_URL]);

  const handleEditClick = (e, mascotaId) => {
    e.stopPropagation();
    navigate(`/editar-mascota/${mascotaId}`);
  };

  const handlePetClick = (mascota) => {
    setSelectedPet(mascota);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Versión Desktop - Sidebar Vertical */}
      <div className="pets-vertical-container">
        <h3>Tus mascotas</h3>
        <div className="pets-vertical">
          {mascotas.map((mascota) => (
            <div
              key={mascota._id}
              className={`pet-vertical-item ${selectedPet?._id === mascota._id ? "selected" : ""
                }`}
              onClick={() => handlePetClick(mascota)}
            >
              <div
                className="pet-img-vertical"
                style={{
                  backgroundImage: mascota.image
                    ? `url(${mascota.image})`
                    : "none",
                  backgroundColor: !mascota.image ? "#dce8c3" : "transparent",
                }}
                title={mascota.name}
              >
                <div
                  className="pet-edit"
                  onClick={(e) => handleEditClick(e, mascota._id)}
                  title="Editar mascota"
                >
                  ✏️
                </div>
              </div>
              <span className="pet-name-vertical">{mascota.name}</span>
            </div>
          ))}
          <div
            className="pet-add-vertical"
            onClick={() => navigate("/registromascota")}
            title="Agregar mascota"
          >
            +
          </div>
        </div>
      </div>

      {/* Versión Mobile - Horizontal */}

      <div className="pets">
        {mascotas.map((mascota) => (
          <div key={mascota._id} className="pet-container">
            <div
              className="pet-img"
              style={{
                backgroundImage: mascota.image
                  ? `url(${mascota.image})`
                  : "none",
                backgroundColor: !mascota.image ? "#dce8c3" : "transparent",
              }}
              title={mascota.name}
            >
              <div
                className="pet-edit"
                onClick={(e) => handleEditClick(e, mascota._id)}
                title="Editar mascota"
              >
                ✏️
              </div>
            </div>
            <span className="pet-name">{mascota.name}</span>
          </div>
        ))}
        <div className="pet-container">
          <div
            className="pet-add"
            onClick={() => navigate("/registromascota")}
            title="Agregar mascota"
          >
            +
          </div>
          <span className="pet-name">Agregar</span>
        </div>
      </div>
    </>
  );
}
