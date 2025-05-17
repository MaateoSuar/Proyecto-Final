import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarMascota = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    fechaNacimiento: '',
    peso: '',
    esterilizado: false,
    vacunas: [],
    alergias: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [fotoMascota, setFotoMascota] = useState(null);
  const [nuevaVacuna, setNuevaVacuna] = useState('');
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const cargarDatosMascota = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        const response = await axios.get(`${API_URL}/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          throw new Error('No se encontraron datos de la mascota');
        }

        const mascota = response.data;
        const formData = {
          nombre: mascota.name || '',
          raza: mascota.breed || '',
          fechaNacimiento: mascota.birthdate ? mascota.birthdate.split('T')[0] : '',
          peso: mascota.weight || '',
          esterilizado: mascota.spayed || false,
          vacunas: mascota.vaccines || [],
          alergias: mascota.allergies || [],
        };
        setFormData(formData);
        setOriginalData(formData);
        if (mascota.image) {
          setFotoMascota(mascota.image);
        }
      } catch (error) {
        console.error('Error al cargar la mascota:', error);
        setError(error.message || 'Error al cargar los datos de la mascota');
        setTimeout(() => {
          navigate('/inicio');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosMascota();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setFormData(prev => ({
      ...prev,
      esterilizado: !prev.esterilizado
    }));
  };

  const handleAddVacuna = () => {
    if (nuevaVacuna.trim()) {
      setFormData(prev => ({
        ...prev,
        vacunas: [...prev.vacunas, nuevaVacuna.trim()],
      }));
      setNuevaVacuna('');
    }
  };

  const handleAddAlergia = () => {
    if (nuevaAlergia.trim()) {
      setFormData(prev => ({
        ...prev,
        alergias: [...prev.alergias, nuevaAlergia.trim()],
      }));
      setNuevaAlergia('');
    }
  };

  const handleRemoveVacuna = (index) => {
    setFormData(prev => ({
      ...prev,
      vacunas: prev.vacunas.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAlergia = (index) => {
    setFormData(prev => ({
      ...prev,
      alergias: prev.alergias.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const form = new FormData();
      
      // Solo enviamos los campos que han sido modificados
      if (formData.nombre !== originalData.nombre) {
        form.append('name', formData.nombre);
      }
      if (formData.raza !== originalData.raza) {
        form.append('breed', formData.raza);
      }
      if (formData.fechaNacimiento !== originalData.fechaNacimiento) {
        form.append('birthdate', formData.fechaNacimiento);
      }
      if (formData.peso !== originalData.peso) {
        form.append('weight', formData.peso);
      }
      if (formData.esterilizado !== originalData.esterilizado) {
        form.append('spayed', formData.esterilizado);
      }
      
      // Las vacunas y alergias siempre se envían completas
      form.append("vaccines", JSON.stringify(formData.vacunas));
      form.append("allergies", JSON.stringify(formData.alergias));

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

      alert('¡Mascota actualizada con éxito!');
      navigate('/inicio');
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      alert(error.response?.data?.message || 'Error al actualizar la mascota');
    }
  };

  if (loading) {
    return (
      <div className="container-mascotas">
        <div className="card-mascota">
          <p className="loading-text">Cargando datos de la mascota...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-mascotas">
        <div className="card-mascota">
          <p className="error-text">Error: {error}</p>
          <p>Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mascotas">
      <div className="card-mascota">
        <div className="header-mascota">
          <label htmlFor="fotoInput" style={{ cursor: 'pointer' }}>
            {fotoMascota ? (
              <img
                src={fotoMascota}
                alt="Mascota"
                className="foto-mascota"
              />
            ) : (
              <div className="icon-mascota">+</div>
            )}
          </label>
          <input
            id="fotoInput"
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <label className="label-mascota">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="input-mascota"
          />
        </div>

        <div>
          <label className="label-mascota">Raza:</label>
          <input
            type="text"
            name="raza"
            value={formData.raza}
            onChange={handleInputChange}
            className="input-mascota"
          />
        </div>

        <div>
          <label className="label-mascota">Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="input-mascota"
          />
        </div>

        <div>
          <label className="label-mascota">Peso (kg):</label>
          <input
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            className="input-mascota"
          />
        </div>

        <label className="checkbox-label-mascota">
          <input
            type="checkbox"
            checked={formData.esterilizado}
            onChange={handleToggleChange}
            className="checkbox-mascota"
          />
          Esterilizado
        </label>

        <div className="list-container-mascota">
          <label className="label-mascota">Vacunas:</label>
          <div className="input-group-mascota">
            <input
              type="text"
              value={nuevaVacuna}
              onChange={(e) => setNuevaVacuna(e.target.value)}
              className="input-mascota"
              style={{ marginBottom: 0 }}
            />
            <button onClick={handleAddVacuna} className="add-button-mascota">
              Agregar
            </button>
          </div>
          {formData.vacunas.map((vacuna, index) => (
            <div key={index} className="list-item-mascota">
              {vacuna}
              <button
                onClick={() => handleRemoveVacuna(index)}
                className="remove-button-mascota"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="list-container-mascota">
          <label className="label-mascota">Alergias:</label>
          <div className="input-group-mascota">
            <input
              type="text"
              value={nuevaAlergia}
              onChange={(e) => setNuevaAlergia(e.target.value)}
              className="input-mascota"
              style={{ marginBottom: 0 }}
            />
            <button onClick={handleAddAlergia} className="add-button-mascota">
              Agregar
            </button>
          </div>
          {formData.alergias.map((alergia, index) => (
            <div key={index} className="list-item-mascota">
              {alergia}
              <button
                onClick={() => handleRemoveAlergia(index)}
                className="remove-button-mascota"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="button-mascota">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditarMascota; 