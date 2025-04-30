import React, { useState, useRef } from "react";
import "../estilos/profile.css";

export default function UsuarioEdit() {
  const [form, setForm] = useState({
    firstName: "Juanse",
    lastName: "Gutierrez",
    phone: "+54 381 123-4567",
    address: "69 Perón Ave, Yerba Buena, TUC",
    idPhoto: true,
    faceVerification: true,
  });

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Formulario guardado:", form);
    alert("Datos guardados correctamente.");
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
          <span>First Name</span>
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Last Name</span>
          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Phone</span>
          <input
            name="phone"
            type="text"
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

