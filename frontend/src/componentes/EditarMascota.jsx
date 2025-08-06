import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BotonVolver from './BotonVolver';
import '../estilos/PerfilMascotas.css';

export default function EditarMascota() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const cargarDatosMascota = async () => {
      if (!id) {
        setError('ID de mascota no proporcionado');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        // Cargar la mascota específica
        const response = await axios.get(`${API_URL}/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mascota = response.data;
        setMascotaSeleccionada(mascota);
        setFormData({
          nombre: mascota.name || '',
          raza: mascota.breed || '',
          fechaNacimiento: mascota.birthdate ? mascota.birthdate.split('T')[0] : new Date().toISOString().split('T')[0],
          peso: mascota.weight || '',
          esterilizado: Boolean(mascota.spayed),
          vacunas: Array.isArray(mascota.vaccines) ? mascota.vaccines : [],
          alergias: Array.isArray(mascota.allergies) ? mascota.allergies : [],
        });
        if (mascota.image) {
          setFotoMascota(mascota.image);
        }

        // Cargar todas las mascotas del usuario
        const responseMascotas = await axios.get(`${API_URL}/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMascotas(responseMascotas.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Error al cargar los datos de la mascota');
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatosMascota();
  }, [id, API_URL]);

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

  const handleCambiarMascota = (mascota) => {
    setMascotaSeleccionada(mascota);
    setFormData({
      nombre: mascota.name || '',
      raza: mascota.breed || '',
      fechaNacimiento: mascota.birthdate ? mascota.birthdate.split('T')[0] : new Date().toISOString().split('T')[0],
      peso: mascota.weight || '',
      esterilizado: Boolean(mascota.spayed),
      vacunas: Array.isArray(mascota.vaccines) ? mascota.vaccines : [],
      alergias: Array.isArray(mascota.allergies) ? mascota.allergies : [],
    });
    setFotoMascota(mascota.image || null);
    // Actualizar la URL sin recargar la página
    navigate(`/editar-mascota/${mascota._id}`, { replace: true });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('name', formData.nombre);
      form.append('breed', formData.raza);
      form.append('birthdate', formData.fechaNacimiento);
      form.append('weight', formData.peso);
      form.append('spayed', formData.esterilizado);
      form.append('vaccines', JSON.stringify(formData.vacunas));
      form.append('allergies', JSON.stringify(formData.alergias));
      if (fotoMascota && !fotoMascota.startsWith('http')) {
        const blob = await (await fetch(fotoMascota)).blob();
        form.append('image', blob, 'mascota.jpg');
      }
      await axios.put(`${API_URL}/pets/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('¡Mascota actualizada con éxito!');
      navigate('/inicio');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar la mascota');
      setError(error.response?.data?.message || 'Error al actualizar la mascota');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Mascota eliminada con éxito');
      navigate('/inicio');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar la mascota');
      setError(error.response?.data?.message || 'Error al eliminar la mascota');
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container"><div className="card"><p>{error}</p><button className="button" onClick={() => navigate('/inicio')}>Volver al inicio</button></div></div>
    );
  }

  return (
    <div className="pagina-usuario">
      <BotonVolver />
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
          <div className="sidebar-title">Mis Mascotas</div>
          {mascotas.map((mascota) => (
            <button 
              key={mascota._id}
              className={`sidebar-item ${mascotaSeleccionada?._id === mascota._id ? 'active' : ''}`}
              onClick={() => handleCambiarMascota(mascota)}
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
          <button
            className="sidebar-item"
            style={{marginTop: '24px', background: '#e0c9a6', color: '#8B5C2A', fontWeight: 'bold', fontSize: '16px'}}
            onClick={() => navigate('/registromascota')}
          >
            ➕ Crear Mascota
          </button>
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
              <div className="botones-editar-mascota" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
                <button className="save-button" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button className="save-button" style={{ backgroundColor: '#dc3545', width: '250px' }} onClick={handleDelete}>
                  {showConfirmDelete ? 'Confirmar Eliminación' : 'Eliminar Mascota'}
                </button>
              </div>
              
              {/* Modal de confirmación */}
              {showConfirmDelete && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}>
                  <div style={{
                    backgroundColor: '#fceecf',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    maxWidth: '400px',
                    width: '90%',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>⚠️ Confirmar Eliminación</h3>
                    <p style={{ marginBottom: '20px', color: '#666' }}>
                      ¿Estás seguro de que quieres eliminar a <strong>{formData.nombre}</strong>?
                    </p>
                    <p style={{ marginBottom: '25px', fontSize: '14px', color: '#999' }}>
                      Esta acción no se puede deshacer.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button 
                        onClick={handleCancelDelete}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          cursor: 'pointer'
                        }}
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleDelete}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '5px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Sí, Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}