import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../estilos/profile.css";

export default function UsuarioEdit() {
  const [form, setForm] = useState({
    name: "",
    phone: "+54 381 123-4567",
    address: "69 Perón Ave, Yerba Buena, TUC",
    idPhoto: true,
    faceVerification: true,
  });

  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Cargar datos desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token"); // Asegúrate que esté guardado tras login
  
    fetch("http://localhost:5000/api/auth/perfil", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "", // asegurate que coincida con el nombre de campo real
          idPhoto: true, // ajustar si tenés esos datos en backend
          faceVerification: true,
        });
      })
      .catch((err) => console.error("Error al obtener perfil:", err));
  }, []); // Se ejecuta solo al cargar el componente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: form.name,
          address: form.address,
          phone: form.phone,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar los datos.");
      }
  
      alert("Datos guardados correctamente.");
      navigate('/inicio');
      console.log("Respuesta:", data);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar los datos.");
    }
  };  

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className="avatar" onClick={handleAvatarClick}>
        {avatar ? (
          <img src={avatar} alt="Avatar" className="avatar-img" />
        ) : (
          <span>+</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Name</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Phone</span>
          <input
            name="phone"
            type="number"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Adress</span>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <div className="item">
          ID Photo {form.idPhoto && <span className="check">✔</span>}
        </div>

        <div className="item">
          Face Verification {form.faceVerification && <span className="check">✔</span>}
        </div>

        <button type="submit" className="save-button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
}
