import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EditarMascota() {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    raza: '',
    fechaNacimiento: '',
    peso: '',
    esterilizado: false,
    vacunas: [],
    alergias: [],
  });

  const [fotoMascota, setFotoMascota] = useState(null);
  const [nuevaVacuna, setNuevaVacuna] = useState('');
  const [nuevaAlergia, setNuevaAlergia] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Cargar datos de la mascota
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
        console.log('Datos recibidos de la mascota:', mascota);

        // Actualizar el estado con los datos recibidos
        setFormData({
          nombre: mascota.name || '',
          raza: mascota.breed || '',
          fechaNacimiento: mascota.birthdate ? mascota.birthdate.split('T')[0] : '',
          peso: mascota.weight || '',
          esterilizado: Boolean(mascota.spayed),
          vacunas: Array.isArray(mascota.vaccines) ? mascota.vaccines : [],
          alergias: Array.isArray(mascota.allergies) ? mascota.allergies : [],
        });

        // Establecer la imagen si existe
        if (mascota.image) {
          setFotoMascota(mascota.image);
        }
      } catch (error) {
        console.error('Error al cargar la mascota:', error);
        setError(error.response?.data?.message || 'Error al cargar los datos de la mascota');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosMascota();
  }, [id, API_URL]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleAddVacuna = () => {
    if (nuevaVacuna.trim()) {
      setFormData(prev => ({
        ...prev,
        vacunas: [...prev.vacunas, nuevaVacuna.trim()]
      }));
      setNuevaVacuna('');
    }
  };

  const handleAddAlergia = () => {
    if (nuevaAlergia.trim()) {
      setFormData(prev => ({
        ...prev,
        alergias: [...prev.alergias, nuevaAlergia.trim()]
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
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const form = new FormData();

      // Agregar todos los campos al FormData
      form.append('name', formData.nombre);
      form.append('breed', formData.raza);
      form.append('birthdate', formData.fechaNacimiento);
      form.append('weight', formData.peso);
      form.append('spayed', formData.esterilizado);
      form.append('vaccines', JSON.stringify(formData.vacunas));
      form.append('allergies', JSON.stringify(formData.alergias));

      // Solo agregar la imagen si es nueva (no es una URL)
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
      console.error('Error al actualizar:', error);
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
      console.error('Error al eliminar:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar la mascota');
      setError(error.response?.data?.message || 'Error al eliminar la mascota');
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.loadingText}>Cargando datos de la mascota...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.button} onClick={() => navigate('/inicio')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          filter: invert(1);
        }
        input[type="number"] {
          color-scheme: dark;
        }
        .delete-button {
          margin-top: 10px;
          width: 100%;
          padding: 12px;
          background-color: #dc3545;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .confirm-delete {
          background-color: #dc3545;
          color: white;
          padding: 10px;
          margin-top: 10px;
          border-radius: 8px;
          text-align: center;
        }
        .confirm-delete button {
          margin: 5px;
          padding: 5px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .confirm-delete button.confirm {
          background-color: #fff;
          color: #dc3545;
        }
        .confirm-delete button.cancel {
          background-color: transparent;
          color: #fff;
          border: 1px solid #fff;
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <label htmlFor="fotoInput" style={{ cursor: 'pointer' }}>
              {fotoMascota ? (
                <img
                  src={fotoMascota}
                  alt="Mascota"
                  style={styles.previewFoto}
                />
              ) : (
                <div style={styles.icon}>+</div>
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
              style={styles.nameInput}
            />
          </div>

          <div style={styles.list}>
            <div style={styles.item}>
              <input
                type="text"
                name="raza"
                placeholder="Raza"
                value={formData.raza}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.item}>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.item}>
              <input
                type="number"
                name="peso"
                placeholder="Peso (kg)"
                value={formData.peso}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.item}>
              <span style={styles.label}>Esterilizado</span>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  name="esterilizado"
                  checked={formData.esterilizado}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    ...styles.slider,
                    backgroundColor: formData.esterilizado ? '#a57449' : '#ccc',
                  }}
                >
                  <span
                    style={{
                      ...styles.knob,
                      transform: formData.esterilizado
                        ? 'translateX(18px)'
                        : 'translateX(0px)',
                    }}
                  />
                </span>
              </label>
            </div>

            <div style={styles.item}>
              <span style={styles.label}>Vacunas</span>
            </div>
            <div style={styles.item}>
              <input
                type="text"
                placeholder="Añadir vacuna"
                value={nuevaVacuna}
                onChange={(e) => setNuevaVacuna(e.target.value)}
                style={{ ...styles.input, flex: 1 }}
              />
              <button onClick={handleAddVacuna} style={styles.addBtn}>+</button>
            </div>
            {formData.vacunas.map((vacuna, i) => (
              <div style={{ ...styles.item, color: '#000' }} key={i}>
                {vacuna}
                <button onClick={() => handleRemoveVacuna(i)} style={styles.removeBtn}>×</button>
              </div>
            ))}

            <div style={styles.item}>
              <span style={styles.label}>Alergias</span>
            </div>
            <div style={styles.item}>
              <input
                type="text"
                placeholder="Añadir alergia"
                value={nuevaAlergia}
                onChange={(e) => setNuevaAlergia(e.target.value)}
                style={{ ...styles.input, flex: 1 }}
              />
              <button onClick={handleAddAlergia} style={styles.addBtn}>+</button>
            </div>
            {formData.alergias.map((alergia, i) => (
              <div style={{ ...styles.item, color: '#000' }} key={i}>
                {alergia}
                <button onClick={() => handleRemoveAlergia(i)} style={styles.removeBtn}>×</button>
              </div>
            ))}
          </div>

          <button 
            style={styles.button} 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          {showConfirmDelete ? (
            <div className="confirm-delete">
              <p>¿Estás seguro de que deseas eliminar esta mascota?</p>
              <button className="confirm" onClick={handleDelete}>Sí, eliminar</button>
              <button className="cancel" onClick={() => setShowConfirmDelete(false)}>Cancelar</button>
            </div>
          ) : (
            <button className="delete-button" onClick={handleDelete}>
              Eliminar Mascota
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#fdefce',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 40,
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fdefce',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    backgroundColor: '#a57449',
    color: 'white',
    fontSize: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFoto: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  nameInput: {
    marginTop: 10,
    border: 'none',
    background: 'none',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a57449',
    textAlign: 'center',
    outline: 'none',
  },
  list: {
    backgroundColor: '#fff8dc',
    width: '100%',
    borderRadius: 12,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  item: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee1bd',
    fontSize: 15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#000',
    fontSize: 15,
    outline: 'none',
  },
  label: {
    color: '#000',
    fontWeight: 500,
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: '#a57449',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#ff4444',
    fontSize: 20,
    cursor: 'pointer',
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 12,
    backgroundColor: '#a57449',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    opacity: props => props.disabled ? 0.7 : 1,
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 40,
    height: 22,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: '0.4s',
    borderRadius: 22,
  },
  knob: {
    position: 'absolute',
    height: 18,
    width: 18,
    left: 2,
    bottom: 2,
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: '0.4s',
  },
  loadingText: {
    textAlign: 'center',
    color: '#a57449',
    fontSize: 16,
    margin: '20px 0',
  },
  errorText: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 16,
    margin: '20px 0',
  },
}; 