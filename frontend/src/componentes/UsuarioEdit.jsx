import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../estilos/profile.css";

export default function UsuarioEdit() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Cargar datos desde localStorage y backend
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
        setForm({
          name: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
          email: data.email || ""
        });
        // Establecer la imagen de perfil actual
        if (data.profileImage) {
          setAvatar(data.profileImage);
        }
      })
      .catch((err) => console.error("Error al obtener perfil:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al cambiar la contraseña");
      }

      toast.success("¡Contraseña actualizada correctamente!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("fullName", form.name);
    formData.append("address", form.address);
    formData.append("phone", form.phone);
    if (fileInputRef.current.files[0]) {
      formData.append("profileImage", fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch(`${API_URL}/auth/perfil`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar los datos.");
      }

      const storedUser = JSON.parse(localStorage.getItem("usuario")) || {};
      storedUser.fullName = data.fullName || form.name;
      storedUser.profileImage = data.profileImage || avatar;
      localStorage.setItem("usuario", JSON.stringify(storedUser));

      toast.success("¡Datos guardados correctamente!");
      navigate("/inicio");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Ocurrió un error al guardar los datos.");
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
          <span>Nombre</span>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            disabled
            className="input-disabled"
          />
        </label>

        <label>
          <span>Teléfono</span>
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          <span>Dirección</span>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="save-button" onClick={handleSave}>
          Guardar
        </button>

        <button type="button" className="change-password-button" onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
        </button>

        {showPasswordForm && (
          <div className="password-form">
            <label>
              <span>Contraseña actual</span>
              <input
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <label>
              <span>Nueva contraseña</span>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <label>
              <span>Confirmar nueva contraseña</span>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </label>

            <button type="button" className="save-password-button" onClick={handleChangePassword}>
              Actualizar contraseña
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
