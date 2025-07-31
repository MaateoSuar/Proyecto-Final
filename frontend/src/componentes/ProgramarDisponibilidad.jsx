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
  const [servicios, setServicios] = useState([
    { type: 'paseo', description: '', price: 0, activo: false },
    { type: 'cuidado', description: '', price: 0, activo: false },
    { type: 'peluqueria', description: '', price: 0, activo: false },
    { type: 'dentista', description: '', price: 0, activo: false }
  ]);
  const [loading, setLoading] = useState(false);
  const [prestadorData, setPrestadorData] = useState(null);

  // Horarios disponibles predefinidos
  const horariosDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Tipos de servicios disponibles
  const tiposServicios = [
    { key: 'paseo', label: 'Paseo de mascotas', icon: '🐕' },
    { key: 'cuidado', label: 'Cuidado de mascotas', icon: '🏠' },
    { key: 'peluqueria', label: 'Peluquería canina', icon: '✂️' },
    { key: 'dentista', label: 'Veterinario', icon: '🩺' }
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
        const prestadorInfo = response.data.data;
        const disponibilidadActual = prestadorInfo.availability || [];
        
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

        // Cargar servicios actuales
        if (prestadorInfo.services && prestadorInfo.services.length > 0) {
          const serviciosActuales = servicios.map(servicio => {
            const servicioExistente = prestadorInfo.services.find(s => s.type === servicio.type);
            return servicioExistente 
              ? { ...servicio, description: servicioExistente.description || '', price: servicioExistente.price || 0, activo: true }
              : servicio;
          });
          setServicios(serviciosActuales);
        }
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

  const toggleServicio = (index) => {
    setServicios(prev => prev.map((servicio, i) => 
      i === index 
        ? { ...servicio, activo: !servicio.activo }
        : servicio
    ));
  };

  const actualizarServicio = (index, campo, valor) => {
    setServicios(prev => prev.map((servicio, i) => 
      i === index 
        ? { ...servicio, [campo]: valor }
        : servicio
    ));
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

      // Preparar servicios activos
      const serviciosActivos = servicios
        .filter(servicio => servicio.activo && servicio.price > 0)
        .map(servicio => ({
          type: servicio.type,
          description: servicio.description,
          price: Number(servicio.price)
        }));

      // Actualizar la disponibilidad en el backend
      await axios.put(`${API_URL}/prestadores/${prestadorData.id}/full-availability`, {
        availability: disponibilidadParaEnviar
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Actualizar servicios en el backend
      await axios.put(`${API_URL}/prestadores/${prestadorData.id}/services`, {
        services: serviciosActivos
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Disponibilidad y servicios actualizados correctamente');
    } catch (error) {
      console.error('Error al guardar disponibilidad:', error);
      toast.error('Error al guardar la disponibilidad y servicios');
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
      <h2>Programar Disponibilidad y Servicios</h2>
      <p className="descripcion">
        Configura los días, horarios, servicios y precios para tu negocio de cuidado de mascotas.
      </p>

      {/* Sección de Servicios */}
      <div className="servicios-section">
        <h3>Servicios Ofrecidos</h3>
        <div className="servicios-container">
          {servicios.map((servicio, index) => (
            <div key={servicio.type} className="servicio-card">
              <div className="servicio-header">
                <label className="servicio-checkbox">
                  <input
                    type="checkbox"
                    checked={servicio.activo}
                    onChange={() => toggleServicio(index)}
                  />
                  <span className="servicio-icon">
                    {tiposServicios.find(t => t.key === servicio.type)?.icon}
                  </span>
                  <span className="servicio-label">
                    {tiposServicios.find(t => t.key === servicio.type)?.label}
                  </span>
                </label>
              </div>

              {servicio.activo && (
                <div className="servicio-details">
                  <div className="input-group">
                    <label>Descripción (opcional):</label>
                    <input
                      type="text"
                      value={servicio.description}
                      onChange={(e) => actualizarServicio(index, 'description', e.target.value)}
                      placeholder="Describe tu servicio..."
                      className="input-descripcion"
                    />
                  </div>
                  <div className="input-group">
                    <label>Precio por hora ($):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={servicio.price}
                      onChange={(e) => actualizarServicio(index, 'price', e.target.value)}
                      placeholder="0.00"
                      className="input-precio"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Disponibilidad */}
      <div className="disponibilidad-section">
        <h3>Disponibilidad Semanal</h3>
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
      </div>

      <div className="acciones">
        <button
          className="btn-guardar"
          onClick={guardarDisponibilidad}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>

      {/* Resumen */}
      <div className="resumen">
        <h3>Resumen de configuración:</h3>
        
        <div className="resumen-servicios">
          <h4>Servicios activos:</h4>
          {servicios.filter(s => s.activo && s.price > 0).map(servicio => (
            <div key={servicio.type} className="resumen-servicio">
              <strong>{tiposServicios.find(t => t.key === servicio.type)?.label}:</strong> ${servicio.price}/h
              {servicio.description && <span> - {servicio.description}</span>}
            </div>
          ))}
          {servicios.filter(s => s.activo && s.price > 0).length === 0 && (
            <p>No hay servicios configurados</p>
          )}
        </div>

        <div className="resumen-dias">
          <h4>Días disponibles:</h4>
          {diasSemana.map(({ key, label }) => {
            const config = disponibilidad[key];
            if (!config.activo || config.horarios.length === 0) return null;
            
            return (
              <div key={key} className="resumen-dia">
                <strong>{label}:</strong> {config.horarios.join(', ')}
              </div>
            );
          })}
          {diasSemana.every(({ key }) => !disponibilidad[key].activo || disponibilidad[key].horarios.length === 0) && (
            <p>No hay días configurados</p>
          )}
        </div>
      </div>
    </div>
  );
} 