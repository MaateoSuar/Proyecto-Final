import React, { use, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


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

  const formatearFecha = (fecha) => {
    const [yyyy, mm, dd] = fecha.split('-');
  return `${dd}/${mm}/${yyyy}`;
  };

  const handleSave = async () => {
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

    const response = await axios.post(`${API_URL}/pets`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log('Token enviado:', localStorage.getItem('token'));

    alert('¡Mascota registrada!');
    navigate('/inicio');
  } catch (error) {
    console.error(error);
    alert('Error al guardar la mascota');
  }
};

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
                  checked={formData.esterilizado}
                  onChange={handleToggleChange}
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
              <div style={{ ...styles.item, color: '#000' }} key={i}>{vacuna}</div>
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
              <div style={{ ...styles.item, color: '#000' }} key={i}>{alergia}</div>
            ))}
          </div>

          <button style={styles.button} onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    backgroundColor: '#fdefce',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 40,
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
    top: 0, left: 0, right: 0, bottom: 0,
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
};

export default PerfilMascotas;