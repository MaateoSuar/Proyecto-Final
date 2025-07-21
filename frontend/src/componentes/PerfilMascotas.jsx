import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/perfilmascotas.css';

const PerfilMascotas = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    fechaNacimiento: new Date().toISOString().split('T')[0],
    peso: '',
    esterilizado: false,
    vacunas: [],
    alergias: [],
  });

  const [fotoMascota, setFotoMascota] = useState(null);
  const [nuevaVacuna, setNuevaVacuna] = useState('');
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoMascota(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleChange = () => {
    setFormData({ ...formData, esterilizado: !formData.esterilizado });
  };

  const handleAddVacuna = () => {
    if (nuevaVacuna.trim()) {
      setFormData({
        ...formData,
        vacunas: [...formData.vacunas, nuevaVacuna],
      });
      setNuevaVacuna('');
    }
  };

  const handleAddAlergia = () => {
    if (nuevaAlergia.trim()) {
      setFormData({
        ...formData,
        alergias: [...formData.alergias, nuevaAlergia],
      });
      setNuevaAlergia('');
    }
  };

  const handleRemoveVacuna = (index) => {
    setFormData({
      ...formData,
      vacunas: formData.vacunas.filter((_, i) => i !== index),
    });
  };

  const handleRemoveAlergia = (index) => {
    setFormData({
      ...formData,
      alergias: formData.alergias.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append('name', formData.nombre);
      form.append('type', 'dog');
      form.append('breed', formData.raza);
      form.append('birthdate', formData.fechaNacimiento);
      form.append('weight', formData.peso);
      form.append('spayed', formData.esterilizado);
      form.append("vaccines", JSON.stringify(formData.vacunas));
      form.append("allergies", JSON.stringify(formData.alergias));

      if (fotoMascota) {
        const blob = await (await fetch(fotoMascota)).blob();
        form.append('image', blob, 'mascota.jpg');
      }

      await axios.post(`${API_URL}/pets`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('¡Mascota registrada con éxito!');
      navigate('/inicio');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la mascota');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative' }}>
      <button
        className="back-button"
        onClick={() => navigate('/inicio')}
        aria-label="Volver al inicio"
      >
        &larr;
      </button>
      <div className="card">
        <div className="header">
          <label htmlFor="fotoInput" style={{ cursor: 'pointer' }}>
            {fotoMascota ? (
              <img src={fotoMascota} alt="Mascota" className="previewFoto" />
            ) : (
              <div className="icon">+</div>
            )}
          </label>
          <input
            id="fotoInput"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            style={{ display: 'none' }}
          />
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="nameInput"
          />
        </div>

        <div className="list">
          <div className="item">
            <input
              type="text"
              name="raza"
              placeholder="Raza"
              value={formData.raza}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="item">
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="item">
            <input
              type="number"
              name="peso"
              placeholder="Peso (kg)"
              value={formData.peso}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="item">
            <span className="label">Esterilizado</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.esterilizado}
                onChange={handleToggleChange}
                style={{ display: 'none' }}
              />
              <span
                className="slider"
                style={{
                  backgroundColor: formData.esterilizado ? '#a57449' : '#ccc',
                }}
              >
                <span
                  className="knob"
                  style={{
                    transform: formData.esterilizado
                      ? 'translateX(22px)'
                      : 'translateX(0px)',
                  }}
                />
              </span>
            </label>
          </div>

          <div className="item full-width">
            <span className="label">Vacunas</span>
          </div>
          <div className="item full-width">
            <input
              type="text"
              placeholder="Añadir vacuna"
              value={nuevaVacuna}
              onChange={(e) => setNuevaVacuna(e.target.value)}
              className="input"
              style={{ flex: 1 }}
            />
            <button onClick={handleAddVacuna} className="addBtn">+</button>
          </div>
          <div className="tags-container">
            {formData.vacunas.map((vacuna, i) => (
              <div className="vacuna-tag" key={i}>
                <span>{vacuna}</span>
                <button className="remove-tag-btn" onClick={() => handleRemoveVacuna(i)}>×</button>
              </div>
            ))}
          </div>

          <div className="item full-width">
            <span className="label">Alergias</span>
          </div>
          <div className="item full-width">
            <input
              type="text"
              placeholder="Añadir alergia"
              value={nuevaAlergia}
              onChange={(e) => setNuevaAlergia(e.target.value)}
              className="input"
              style={{ flex: 1 }}
            />
            <button onClick={handleAddAlergia} className="addBtn">+</button>
          </div>
          <div className="tags-container">
            {formData.alergias.map((alergia, i) => (
              <div className="alergia-tag" key={i}>
                <span>{alergia}</span>
                <button className="remove-tag-btn" onClick={() => handleRemoveAlergia(i)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <button className="button" onClick={handleSave}>
          {isLoading ? 'Guardando...' : 'Guardar Mascota'}
        </button>
      </div>
    </div>
  );
};

export default PerfilMascotas;
