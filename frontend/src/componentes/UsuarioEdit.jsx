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
    nickname: "",
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
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Cargar datos desde localStorage y backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    fetch(`${API_URL}/auth/perfil`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Separar fullName si no hay firstName/lastName
        let firstName = data.firstName || "";
        let lastName = data.lastName || "";
        if ((!firstName || !lastName) && data.fullName) {
          const parts = data.fullName.trim().split(" ");
          firstName = parts.slice(0, -1).join(" ") || "";
          lastName = parts.slice(-1).join(" ") || "";
        }
        setForm({
          firstName,
          lastName,
          nickname: data.nickname || "",
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
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener perfil:", err);
        setIsLoading(false);
      });
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
    // Unir nombre y apellido en fullName
    formData.append("fullName", `${form.firstName} ${form.lastName}`.trim());
    formData.append("nickname", form.nickname);
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
      storedUser.firstName = form.firstName;
      storedUser.lastName = form.lastName;
      storedUser.nickname = data.nickname || form.nickname;
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    
    <div className="container">
      {/* Botón de editar en la esquina superior derecha del formulario */}
      <button 
        className="edit-button-form"
        onClick={() => {
          if (showPasswordForm) {
            // Si estamos en el formulario de contraseña, volver al perfil en modo visualización
            setShowPasswordForm(false);
            // También salir del modo de edición si estaba activo
            if (isEditMode) {
              window.dispatchEvent(new CustomEvent('toggleEditMode'));
            }
          } else {
            // Si estamos en el perfil, alternar modo de edición
            window.dispatchEvent(new CustomEvent('toggleEditMode'));
          }
        }}
        title={showPasswordForm ? "Volver al perfil" : (isEditMode ? "Cerrar edición" : "Editar perfil")}
      >
        {showPasswordForm ? '❌' : (isEditMode ? '❌' : '✏️')}
      </button>
      
      {!showPasswordForm ? (
        <>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
          {/* Información Personal */}
          <div className="form-section">
            <h3 className="profile-section-title">Información Personal</h3>
            
            {/* Avatar dentro de la sección de información personal */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
      <div className="avatar avatar-profile" onClick={handleAvatarClick}>
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
              {isEditMode && (
                <div className="avatar-edit-icon">✏️</div>
              )}
      </div>

        <label>
          <span>Nombre(s)*</span>
              <div className="field-container">
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            disabled={!isEditMode}
            required
                  className={isEditMode ? 'input-editable' : 'input-display'}
          />
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
        </label>
        <label>
          <span>Apellido(s)*</span>
              <div className="field-container">
          <input
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            disabled={!isEditMode}
            required
                  className={isEditMode ? 'input-editable' : 'input-display'}
          />
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
        </label>
        <label>
          <span>Apodo (opcional)</span>
              <div className="field-container">
          <input
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            disabled={!isEditMode}
            placeholder="Apodo (opcional)"
                  className={isEditMode ? 'input-editable' : 'input-display'}
                />
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
            </label>
          </div>

          {/* Información de Contacto */}
          <div className="form-section">
            <h3 className="profile-section-title">Información de Contacto</h3>
            <label>
              <span>Correo electrónico</span>
              <div className="field-container">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="input-display"
                />
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
        </label>
        <label>
          <span>Teléfono</span>
              <div className="field-container">
          <input
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            disabled={!isEditMode}
                  className={isEditMode ? 'input-editable' : 'input-display'}
          />
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
        </label>
        <label>
          <span>Dirección</span>
              <div className="field-container">
          {ubicacionActual ? (
            <input
              name="address"
              type="text"
              value={`${ubicacionActual.calle || ''}${ubicacionActual.numero ? ' ' + ubicacionActual.numero : ''}`}
              disabled
                    className="input-display"
            />
          ) : (
            isEditMode ? (
              <input
                name="address"
                type="text"
                value={''}
                placeholder="Seleccionar una ubicación..."
                      className="input-display"
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
                      className="input-display"
              />
            )
          )}
                {isEditMode && <span className="field-edit-icon">✏️</span>}
              </div>
        </label>
        <label>
          <span>País</span>
              <div className="field-container">
          {isEditMode ? (
                  <div className="select-container">
                <input
                  name="country"
                  type="text"
                      value={country || ""}
                      readOnly
                      className="input-display"
                      placeholder="Selecciona tu país"
                      onClick={() => !countryChanged && document.querySelector('select[name="country"]').focus()}
                      style={{ cursor: countryChanged ? 'default' : 'pointer' }}
                    />
                <select
                  name="country"
                      value={country || ""}
                  onChange={handleCountryChange}
                  required
                      className="input-editable"
                      disabled={countryChanged}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                >
                  <option value="" disabled>Selecciona tu país</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
                    {isEditMode && <span className="field-edit-icon">✏️</span>}
                    <span className="field-edit-icon" style={{ right: '40px', color: '#000' }}>▼</span>
                  </div>
                ) : (
                  <input
                    name="country"
                    type="text"
                    value={country || ""}
                    disabled
                    className="input-display"
                    placeholder="No especificado"
                  />
                )}
                {isEditMode && !countryChanged && (
                  <span style={{ color: '#b85c2a', fontSize: 13, marginTop: 4, display: 'block', position: 'absolute', top: '100%', left: 0 }}>
                    Recuerda: solo puedes cambiar el país una vez.
                  </span>
                )}
              </div>
        </label>
          </div>
        </div>
      </form>

      {/* Espacio reservado o contenedor de botones */}
      {isEditMode && !showPasswordForm ? (
        <div className="buttons-container">
              <button type="submit" className="save-button" onClick={handleSave}>
                Guardar
              </button>

              <button
                type="button"
                className="change-password-button"
            onClick={() => setShowPasswordForm(true)}
              >
            CAMBIAR CONTRASEÑA
              </button>
        </div>
      ) : (
        <div className="buttons-space"></div>
      )}
            </>
      ) : (
        <div className="password-form-main">
          <h3 className="password-form-title">CAMBIAR CONTRASEÑA</h3>

          <div className="password-form-content">
            <label>
              <span>Contraseña actual</span>
              <div className="password-input-container">
                <input
                  name="currentPassword"
                  type={showPasswords.currentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="password-input"
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
                  className="password-input"
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
                  className="password-input"
                />
                <span 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? '🙉' : '🙈'}
                </span>
              </div>
            </label>

            <div className="password-buttons-container">
              <button type="button" className="update-password-button" onClick={handleChangePassword}>
                ACTUALIZAR CONTRASEÑA
              </button>
              
              <button
                type="button"
                className="cancel-password-button"
                onClick={() => setShowPasswordForm(false)}
              >
                CANCELAR
            </button>
            </div>
          </div>
          </div>
        )}
    </div>
  );
}
