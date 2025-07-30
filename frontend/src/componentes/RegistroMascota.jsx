import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/PerfilMascotas.css';
import '../estilos/PaginaUsuario.css';

export default function RegistroMascota() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const cargarMascotas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMascotas(response.data);
      } catch (error) {
        console.error('Error al cargar mascotas:', error);
      }
    };
    cargarMascotas();
  }, [API_URL]);

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
    <div className="pagina-usuario">
      {/* Barra lateral */}
      <div className="sidebar">
        {/* Botón de regreso */}
        <button
          className="back-button-sidebar"
          onClick={() => navigate('/inicio')}
        >
          <span className="back-arrow">&larr;</span>
        </button>

        {/* Menú principal */}
        <div className="sidebar-menu">
          <div className="sidebar-title">Mis mascotas</div>
          {mascotas.map((mascota) => (
            <button 
              key={mascota._id}
              className="sidebar-item"
              onClick={() => navigate(`/editar-mascota/${mascota._id}`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
            >
              {mascota.image ? (
                <img src={mascota.image} alt={mascota.name} style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', flexShrink: 0 }} />
              ) : (
                <span style={{ marginRight: '10px', fontSize: '20px' }}>🐾</span>
              )}
              <span style={{ textAlign: 'left' }}>{mascota.name || 'Sin nombre'}</span>
            </button>
          ))}
        </div>

        {/* Enlaces adicionales */}
        <div className="sidebar-links">
          <div className="sidebar-link">PetCare®</div>
          <div className="sidebar-link" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</div>
          <div className="sidebar-link" onClick={() => navigate('/contacto')}>Contacto</div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="main-content">
        <div className="editar-mascota-container" style={{ position: 'relative' }}>
          <div className="mascota-card">
            <div className="card editar-mascota-card">
              <div className="list">
                <div className="item full-width" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label htmlFor="fotoInput" style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    {fotoMascota ? (
                      <img src={fotoMascota} alt="Mascota" className="previewFoto editar-mascota-foto" />
                    ) : (
                      <div className="icon editar-mascota-foto">+</div>
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
                    className="editar-mascota-input"
                    style={{ marginTop: '10px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#a57449' }}
                  />
                </div>
                <div className="editar-mascota-item">
                  <input
                    type="text"
                    name="raza"
                    placeholder="Raza"
                    value={formData.raza}
                    onChange={handleInputChange}
                    className="editar-mascota-input"
                  />
                </div>
                <div className="editar-mascota-item">
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="editar-mascota-input"
                  />
                </div>
                <div className="editar-mascota-item">
                  <input
                    type="number"
                    name="peso"
                    placeholder="Peso (kg)"
                    value={formData.peso}
                    onChange={handleInputChange}
                    className="editar-mascota-input"
                  />
                </div>
                <div className="editar-mascota-item">
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#8B5C2A' }}>Esterilizado</span>
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
                <div className="editar-mascota-item full-width">
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#8B5C2A' }}>Vacunas</span>
                </div>
                <div className="editar-mascota-item full-width">
                  <input
                    type="text"
                    placeholder="Añadir vacuna"
                    value={nuevaVacuna}
                    onChange={(e) => setNuevaVacuna(e.target.value)}
                    className="editar-mascota-input"
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
                <div className="editar-mascota-item full-width">
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#8B5C2A' }}>Alergias</span>
                </div>
                <div className="editar-mascota-item full-width">
                  <input
                    type="text"
                    placeholder="Añadir alergia"
                    value={nuevaAlergia}
                    onChange={(e) => setNuevaAlergia(e.target.value)}
                    className="editar-mascota-input"
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
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
                <button className="save-button" style={{ width: '250px' }} onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Mascota'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 