import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/PerfilMascotas.css';

export default function EditarMascota() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const response = await axios.get(`${API_URL}/pets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const mascota = response.data;
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

  if (isLoading) {
    return (
      <div className="container"><div className="card"><p>Cargando datos de la mascota...</p></div></div>
    );
  }
  if (error) {
    return (
      <div className="container"><div className="card"><p>{error}</p><button className="button" onClick={() => navigate('/inicio')}>Volver al inicio</button></div></div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative' }}>
      <button
        className="back-button"
        onClick={() => navigate('/inicio')}
        aria-label="Volver al inicio"
      >
        ← Atrás
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
          {formData.vacunas.map((vacuna, i) => (
            <div className="item full-width" key={i}>{vacuna}</div>
          ))}
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
          {formData.alergias.map((alergia, i) => (
            <div className="item full-width" key={i}>{alergia}</div>
          ))}
        </div>
        <button className="button" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {showConfirmDelete ? (
          <div className="confirm-delete" style={{ backgroundColor: '#dc3545', color: 'white', padding: 10, marginTop: 10, borderRadius: 8, textAlign: 'center' }}>
            <p>¿Estás seguro de que deseas eliminar esta mascota?</p>
            <button className="confirm" style={{ margin: 5, padding: '5px 15px', border: 'none', borderRadius: 4, cursor: 'pointer', backgroundColor: '#fff', color: '#dc3545' }} onClick={handleDelete}>Sí, eliminar</button>
            <button className="cancel" style={{ margin: 5, padding: '5px 15px', border: '1px solid #fff', borderRadius: 4, cursor: 'pointer', backgroundColor: 'transparent', color: '#fff' }} onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
          </div>
        ) : (
          <button className="delete-button" style={{ marginTop: 10, width: '100%', padding: 12, backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: 8, cursor: 'pointer' }} onClick={handleDelete}>
            Eliminar Mascota
          </button>
        )}
      </div>
    </div>
  );
}