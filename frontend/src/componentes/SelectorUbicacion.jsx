import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaHome, FaBriefcase, FaMapPin, FaTimes } from 'react-icons/fa';
import { useUbicacion } from '../context/UbicacionContext';
import '../estilos/home/ubicacion.css';

const SelectorUbicacion = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const { 
    ubicacionActual, 
    ubicacionesGuardadas, 
    seleccionarUbicacion, 
    guardarUbicacion,
    cargando 
  } = useUbicacion();

  const [nuevaUbicacion, setNuevaUbicacion] = useState({
    nombre: '',
    tipo: 'casa',
    calle: '',
    numero: '',
    referencia: ''
  });

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'casa':
        return <FaHome />;
      case 'trabajo':
        return <FaBriefcase />;
      default:
        return <FaMapPin />;
    }
  };

  const handleGuardarUbicacion = async (e) => {
    e.preventDefault();
    try {
      const ubicacionGuardada = await guardarUbicacion(nuevaUbicacion);
      seleccionarUbicacion(ubicacionGuardada);
      setMostrarModal(false);
      setNuevaUbicacion({
        nombre: '',
        tipo: 'casa',
        calle: '',
        numero: '',
        referencia: ''
      });
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (cargando) {
    return <div className="selector-ubicacion">Cargando ubicaciones...</div>;
  }

  return (
    <div className="selector-ubicacion">
      <div 
        className="ubicacion-principal" 
        onClick={() => setMostrarModal(true)}
      >
        <FaMapMarkerAlt className="icono-ubicacion" />
        <div className="texto-ubicacion">
          {ubicacionActual ? (
            <>
              <span className="etiqueta-ubicacion">{ubicacionActual.nombre}</span>
              <span className="direccion-ubicacion">
                {ubicacionActual.calle} {ubicacionActual.numero}
              </span>
            </>
          ) : (
            <span className="sin-ubicacion">Seleccionar ubicación</span>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Seleccionar ubicación</h2>
              <button className="cerrar-modal" onClick={() => setMostrarModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="ubicaciones-guardadas">
              {ubicacionesGuardadas.map(ubicacion => (
                <div 
                  key={ubicacion._id}
                  className={`ubicacion-item ${ubicacionActual?._id === ubicacion._id ? 'seleccionada' : ''}`}
                  onClick={() => {
                    seleccionarUbicacion(ubicacion);
                    setMostrarModal(false);
                  }}
                >
                  <div className="ubicacion-icono">
                    {getIconoTipo(ubicacion.tipo)}
                  </div>
                  <div className="ubicacion-info">
                    <span className="ubicacion-nombre">{ubicacion.nombre}</span>
                    <span className="ubicacion-direccion">
                      {ubicacion.calle} {ubicacion.numero}
                    </span>
                    {ubicacion.referencia && (
                      <span className="ubicacion-referencia">{ubicacion.referencia}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="separador">
              <span>o agregar nueva ubicación</span>
            </div>

            <form onSubmit={handleGuardarUbicacion} className="formulario-ubicacion">
              <div className="campo-formulario">
                <label>Nombre de la ubicación</label>
                <input
                  type="text"
                  placeholder="ej: Casa, Trabajo, Casa de mis padres"
                  value={nuevaUbicacion.nombre}
                  onChange={e => setNuevaUbicacion({...nuevaUbicacion, nombre: e.target.value})}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label>Tipo de ubicación</label>
                <div className="tipos-ubicacion">
                  <button
                    type="button"
                    className={`tipo-btn ${nuevaUbicacion.tipo === 'casa' ? 'activo' : ''}`}
                    onClick={() => setNuevaUbicacion({...nuevaUbicacion, tipo: 'casa'})}
                  >
                    <FaHome /> Casa
                  </button>
                  <button
                    type="button"
                    className={`tipo-btn ${nuevaUbicacion.tipo === 'trabajo' ? 'activo' : ''}`}
                    onClick={() => setNuevaUbicacion({...nuevaUbicacion, tipo: 'trabajo'})}
                  >
                    <FaBriefcase /> Trabajo
                  </button>
                  <button
                    type="button"
                    className={`tipo-btn ${nuevaUbicacion.tipo === 'otro' ? 'activo' : ''}`}
                    onClick={() => setNuevaUbicacion({...nuevaUbicacion, tipo: 'otro'})}
                  >
                    <FaMapPin /> Otro
                  </button>
                </div>
              </div>

              <div className="campo-formulario">
                <label>Calle</label>
                <input
                  type="text"
                  placeholder="Nombre de la calle"
                  value={nuevaUbicacion.calle}
                  onChange={e => setNuevaUbicacion({...nuevaUbicacion, calle: e.target.value})}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label>Número</label>
                <input
                  type="text"
                  placeholder="Número de la dirección"
                  value={nuevaUbicacion.numero}
                  onChange={e => setNuevaUbicacion({...nuevaUbicacion, numero: e.target.value})}
                  required
                />
              </div>

              <div className="campo-formulario">
                <label>Referencia (opcional)</label>
                <input
                  type="text"
                  placeholder="ej: Portón negro, timbre 2, entre calles X e Y"
                  value={nuevaUbicacion.referencia}
                  onChange={e => setNuevaUbicacion({...nuevaUbicacion, referencia: e.target.value})}
                />
              </div>

              <button type="submit" className="guardar-ubicacion">
                Guardar ubicación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectorUbicacion; 