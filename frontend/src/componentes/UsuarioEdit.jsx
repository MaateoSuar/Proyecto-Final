import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../estilos/profile.css";
import { useUbicacion } from '../context/UbicacionContext';
import countries from '../utils/countries';

export default function UsuarioEdit({ isEditMode }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const { ubicacionActual } = useUbicacion();
  const [country, setCountry] = useState('');
  const [countryChanged, setCountryChanged] = useState(false);
  const [showCountryWarning, setShowCountryWarning] = useState(false);

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
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: data.address || "",
          email: data.email || ""
        });
        setCountry(data.country || '');
        setCountryChanged(!!data.countryChanged);
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

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setShowCountryWarning(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("address", form.address);
    formData.append("phone", form.phone);
    if (fileInputRef.current.files[0]) {
      formData.append("profileImage", fileInputRef.current.files[0]);
    }
    formData.append("country", country);
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
        if (data.msg && data.msg.includes('Solo puedes cambiar el país una vez')) {
          toast.warn('Solo puedes cambiar el país hasta una vez. Si necesitas cambiarlo de nuevo, contacta soporte.');
        }
        throw new Error(data.msg || "Error al actualizar los datos.");
      }

      const storedUser = JSON.parse(localStorage.getItem("usuario")) || {};
      storedUser.firstName = data.firstName || form.firstName;
      storedUser.lastName = data.lastName || form.lastName;
      storedUser.profileImage = data.profileImage || avatar;
      storedUser.country = data.country || country;
      storedUser.countryChanged = data.countryChanged;
      localStorage.setItem("usuario", JSON.stringify(storedUser));

      toast.success("¡Datos guardados correctamente!");
      navigate("/inicio");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(error.message || "Ocurrió un error al guardar los datos.");
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
          disabled={!isEditMode}
        />
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Nombre(s)*</span>
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            disabled={!isEditMode}
            required
          />
        </label>
        <label>
          <span>Apellido(s)*</span>
          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            disabled={!isEditMode}
            required
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
            disabled={!isEditMode}
          />
        </label>

        <label>
          <span>Dirección</span>
          {ubicacionActual ? (
            <input
              name="address"
              type="text"
              value={`${ubicacionActual.calle || ''}${ubicacionActual.numero ? ' ' + ubicacionActual.numero : ''}`}
              disabled
              className="input-disabled"
            />
          ) : (
            isEditMode ? (
              <input
                name="address"
                type="text"
                value={''}
                placeholder="Seleccionar una ubicación..."
                className="input-disabled"
                readOnly
                style={{ cursor: 'pointer', background: '#f8f8f8' }}
                onClick={() => window.dispatchEvent(new CustomEvent('abrirSelectorUbicacion'))}
              />
            ) : (
              <input
                name="address"
                type="text"
                value={''}
                disabled
                className="input-disabled"
              />
            )
          )}
        </label>

        <label>
          <span>País</span>
          {isEditMode ? (
            countryChanged ? (
              <>
                <input
                  name="country"
                  type="text"
                  value={country}
                  disabled
                  className="input-contrasena input-disabled"
                />
              </>
            ) : (
              <>
                <select
                  name="country"
                  value={country}
                  onChange={handleCountryChange}
                  required
                  className="input-contrasena"
                >
                  <option value="" disabled>Selecciona tu país</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {showCountryWarning && (
                  <span style={{ color: '#b85c2a', fontSize: 13, marginTop: 4, display: 'block' }}>
                    Recuerda: solo puedes cambiar el país una vez.
                  </span>
                )}
              </>
            )
          ) : (
            <input
              name="country"
              type="text"
              value={country}
              disabled
              className="input-contrasena input-disabled"
            />
          )}
        </label>

          {isEditMode && (
            <>
              <button type="submit" className="save-button" onClick={handleSave}>
                Guardar
              </button>

              <button
                type="button"
                className="change-password-button"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
              </button>
            </>
          )}


        {showPasswordForm && (
          <div className="password-form">
            <label>
              <span>Contraseña actual</span>
              <div className="password-input-container">
                <input
                  name="currentPassword"
                  type={showPasswords.currentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
                <span 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {showPasswords.currentPassword ? '🙉' : '🙈'}
                </span>
              </div>
            </label>

            <label>
              <span>Nueva contraseña</span>
              <div className="password-input-container">
                <input
                  name="newPassword"
                  type={showPasswords.newPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  disabled={!isEditMode}
                />
                <span 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showPasswords.newPassword ? '🙉' : '🙈'}
                </span>
              </div>
            </label>

            <label>
              <span>Confirmar nueva contraseña</span>
              <div className="password-input-container">
                <input
                  name="confirmPassword"
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <span 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? '🙉' : '🙈'}
                </span>
              </div>
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
