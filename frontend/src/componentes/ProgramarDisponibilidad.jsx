import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../estilos/ProgramarDisponibilidad.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProgramarDisponibilidad() {
  const [disponibilidad, setDisponibilidad] = useState({
    lunes: { activo: false, horarios: [] },
    martes: { activo: false, horarios: [] },
    miercoles: { activo: false, horarios: [] },
    jueves: { activo: false, horarios: [] },
    viernes: { activo: false, horarios: [] },
    sabado: { activo: false, horarios: [] },
    domingo: { activo: false, horarios: [] }
  });
  const [loading, setLoading] = useState(false);
  const [prestadorData, setPrestadorData] = useState(null);

  // Horarios disponibles predefinidos
  const horariosDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  useEffect(() => {
    cargarDisponibilidadActual();
  }, []);

  const cargarDisponibilidadActual = async () => {
    try {
      const prestador = JSON.parse(localStorage.getItem('prestador'));
      if (!prestador || !prestador.id) {
        toast.error('No se encontró información del prestador');
        return;
      }

      setPrestadorData(prestador);

      // Obtener la disponibilidad actual del prestador
      const response = await axios.get(`${API_URL}/prestadores/${prestador.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        const disponibilidadActual = response.data.data.availability || [];
        
        // Mapear la disponibilidad actual al estado local
        const nuevaDisponibilidad = { ...disponibilidad };
        
        disponibilidadActual.forEach(dia => {
          // Normalizar el nombre del día (quitar acentos y convertir a minúsculas)
          let diaKey = dia.day.toLowerCase()
            .replace('á', 'a')
            .replace('é', 'e')
            .replace('í', 'i')
            .replace('ó', 'o')
            .replace('ú', 'u');
          
          if (nuevaDisponibilidad[diaKey]) {
            nuevaDisponibilidad[diaKey] = {
              activo: true,
              horarios: dia.slots || []
            };
          }
        });

        setDisponibilidad(nuevaDisponibilidad);
      }
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      toast.error('Error al cargar la disponibilidad actual');
    }
  };

  const toggleDia = (dia) => {
    setDisponibilidad(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        activo: !prev[dia].activo,
        horarios: !prev[dia].activo ? [] : prev[dia].horarios
      }
    }));
  };

  const toggleHorario = (dia, horario) => {
    setDisponibilidad(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        horarios: prev[dia].horarios.includes(horario)
          ? prev[dia].horarios.filter(h => h !== horario)
          : [...prev[dia].horarios, horario].sort()
      }
    }));
  };

  const guardarDisponibilidad = async () => {
    if (!prestadorData) {
      toast.error('No se encontró información del prestador');
      return;
    }

    setLoading(true);

    try {
      // Preparar los datos para enviar al backend
      const disponibilidadParaEnviar = Object.entries(disponibilidad)
        .filter(([_, config]) => config.activo && config.horarios.length > 0)
        .map(([dia, config]) => ({
          day: dia,
          slots: config.horarios
        }));

      // Actualizar la disponibilidad en el backend
      await axios.put(`${API_URL}/prestadores/${prestadorData.id}/full-availability`, {
        availability: disponibilidadParaEnviar
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Disponibilidad actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar disponibilidad:', error);
      toast.error('Error al guardar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <div className="programar-disponibilidad">
      <h2>Programar Disponibilidad</h2>
      <p className="descripcion">
        Selecciona los días y horarios en los que estarás disponible para recibir reservas.
      </p>

      <div className="dias-container">
        {diasSemana.map(({ key, label }) => (
          <div key={key} className="dia-card">
            <div className="dia-header">
              <label className="dia-checkbox">
                <input
                  type="checkbox"
                  checked={disponibilidad[key].activo}
                  onChange={() => toggleDia(key)}
                />
                <span className="dia-label">{label}</span>
              </label>
            </div>

            {disponibilidad[key].activo && (
              <div className="horarios-container">
                <h4>Horarios disponibles:</h4>
                <div className="horarios-grid">
                  {horariosDisponibles.map(horario => (
                    <label key={horario} className="horario-checkbox">
                      <input
                        type="checkbox"
                        checked={disponibilidad[key].horarios.includes(horario)}
                        onChange={() => toggleHorario(key, horario)}
                      />
                      <span className="horario-label">{horario}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="acciones">
        <button
          className="btn-guardar"
          onClick={guardarDisponibilidad}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Disponibilidad'}
        </button>
      </div>

      <div className="resumen">
        <h3>Resumen de disponibilidad:</h3>
        <div className="resumen-dias">
          {diasSemana.map(({ key, label }) => {
            const config = disponibilidad[key];
            if (!config.activo || config.horarios.length === 0) return null;
            
            return (
              <div key={key} className="resumen-dia">
                <strong>{label}:</strong> {config.horarios.join(', ')}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 