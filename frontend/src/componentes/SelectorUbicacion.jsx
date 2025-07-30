import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaHome, FaBriefcase, FaMapPin, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { useUbicacion } from '../context/UbicacionContext';
import '../estilos/home/ubicacion.css';

const SelectorUbicacion = ({ mobile, oculto }) => {
  const {
    ubicacionActual,
    ubicacionesGuardadas,
    seleccionarUbicacion,
    guardarUbicacion,
    eliminarUbicacion, // <-- Añado función para borrar
    cargando,
    actualizarUbicacion // <-- Añado función para actualizar
  } = useUbicacion();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [direccion, setDireccion] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [coordenadas, setCoordenadas] = useState(null);
  const [cargandoSug, setCargandoSug] = useState(false);
  const [detalle, setDetalle] = useState({ nombre: '', tipo: 'casa', referencia: '' });
  const [partes, setPartes] = useState({});
  const [editando, setEditando] = useState(null); // id de la ubicación en edición
  const [formEdicion, setFormEdicion] = useState({ nombre: '', tipo: 'casa', referencia: '', provincia: '', ciudad: '', direccion: '' });
  const [confirmarBorrado, setConfirmarBorrado] = useState(null); // id de la ubicación a borrar
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setMostrarModal(false);
    };
    window.addEventListener('keydown', handler);

    // Escuchar evento global para abrir el modal desde cualquier parte
    const abrirModal = () => setMostrarModal(true);
    window.addEventListener('abrirSelectorUbicacion', abrirModal);

    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('abrirSelectorUbicacion', abrirModal);
    };
  }, []);

  const buscarSugerencias = async (input) => {
    if (!input) return;
    setCargandoSug(true);
    try {
      const res = await fetch(`${API_URL}/sugerencias?input=${encodeURIComponent(input)}`);
      const data = await res.json();
      setSugerencias(data.status === 'OK' ? data.predictions : []);
    } catch (error) {
      setSugerencias([]);
    } finally {
      setCargandoSug(false);
    }
  };

  const handleSelect = async (placeId, descripcion) => {
    setDireccion(descripcion);
    setSugerencias([]);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const latLng = results[0].geometry.location;
        const components = results[0].address_components;
        const calle = components.find(c => c.types.includes("route"))?.long_name || '';
        const numero = components.find(c => c.types.includes("street_number"))?.long_name || '';
        const ciudad = components.find(c => c.types.includes("locality"))?.long_name || '';
        const provincia = components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || '';
        const pais = components.find(c => c.types.includes("country"))?.long_name || '';
        setPartes({ calle, numero, ciudad, provincia, pais });
        setCoordenadas({ lat: latLng.lat(), lng: latLng.lng() });
      }
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!coordenadas) return alert('Primero selecciona una dirección.');
    const nueva = {
      nombre: detalle.nombre,
      tipo: detalle.tipo,
      ...partes,
      coordenadas,
      referencia: detalle.referencia
    };
    try {
      const res = await guardarUbicacion(nueva);
      seleccionarUbicacion(res);
      setMostrarModal(false);
      setDireccion('');
      setDetalle({ nombre: '', tipo: 'casa', referencia: '' });
      setCoordenadas(null);
      setPartes({});
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
    }
  };

  // Función para iniciar edición
  const handleEditar = (ubicacion) => {
    setEditando(ubicacion._id);
    setFormEdicion({
      nombre: ubicacion.nombre,
      tipo: ubicacion.tipo,
      referencia: ubicacion.referencia || '',
      provincia: ubicacion.provincia || '',
      ciudad: ubicacion.ciudad || '',
      direccion: `${ubicacion.calle || ''} ${ubicacion.numero || ''}`.trim(),
    });
  };
  // Función para guardar cambios
  const guardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await actualizarUbicacion(editando, {
        nombre: formEdicion.nombre,
        tipo: formEdicion.tipo,
        referencia: formEdicion.referencia
      });
      setEditando(null);
    } catch (error) {
      // Manejo de error
    }
  };

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'casa': return <FaHome />;
      case 'trabajo': return <FaBriefcase />;
      default: return <FaMapPin />;
    }
  };

  if (cargando) return oculto ? null : <div className="selector-ubicacion">Cargando ubicaciones...</div>;

  // Si está oculto, solo renderiza el modal si está activo
  if (oculto) {
    return mostrarModal ? (
      <>
        {mostrarModal && (
          <div className="modal-overlay fade-in" onClick={() => setMostrarModal(false)}>
            <div className="modal-contenido" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Seleccionar ubicación</h2>
                <button className="cerrar-modal" onClick={() => setMostrarModal(false)}><FaTimes /></button>
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
                    <div className="ubicacion-icono">{getIconoTipo(ubicacion.tipo)}</div>
                    <div className="ubicacion-info">
                      <span className="ubicacion-nombre">{ubicacion.nombre}</span>
                      <span className="ubicacion-direccion">{ubicacion.calle} {ubicacion.numero}</span>
                      {ubicacion.referencia && <span className="ubicacion-referencia">{ubicacion.referencia}</span>}
                    </div>
                    <button
                      className="editar-ubicacion-btn btn-marron"
                      type="button"
                      onClick={e => { e.stopPropagation(); handleEditar(ubicacion); }}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="borrar-ubicacion-btn btn-marron"
                      type="button"
                      onClick={e => { e.stopPropagation(); setConfirmarBorrado(ubicacion._id); }}
                      title="Borrar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="separador"><span>o agregar nueva ubicación</span></div>

              <form onSubmit={handleGuardar} className="formulario-ubicacion">
                <div className="campo-formulario">
                  <label>Nombre</label>
                  <input type="text" placeholder="ej: Casa de mamá" value={detalle.nombre} onChange={e => setDetalle(prev => ({ ...prev, nombre: e.target.value }))} required />
                </div>

                <div className="campo-formulario">
                  <label>Tipo</label>
                  <div className="tipos-ubicacion" role="radiogroup">
                    {['casa', 'trabajo', 'otro'].map(tipo => (
                      <button
                        type="button"
                        key={tipo}
                        role="radio"
                        className={`tipo-btn ${detalle.tipo === tipo ? 'activo' : ''}`}
                        aria-checked={detalle.tipo === tipo}
                        onClick={() => setDetalle(prev => ({ ...prev, tipo }))}
                      >
                        {getIconoTipo(tipo)} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="campo-formulario">
                  <label>Dirección</label>
                  <input
                    type="text"
                    placeholder="ej: Av. Mitre 1234, Tucumán"
                    value={direccion}
                    className={coordenadas ? 'is-valid' : 'is-invalid'}
                    onChange={e => {
                      setDireccion(e.target.value);
                      buscarSugerencias(e.target.value);
                      setCoordenadas(null);
                    }}
                    required
                  />
                  {direccion && <span className="clear-input" onClick={() => setDireccion('')}>×</span>}
                  <div className="lista-sugerencias">
                    {cargandoSug ? <div className="spinner-autocomplete" /> :
                      sugerencias.map(s => (
                        <div
                          key={s.place_id}
                          className="item-sugerencia"
                          onClick={() => handleSelect(s.place_id, s.description)}
                        >
                          <strong>{s.structured_formatting?.main_text}</strong>{' '}
                          <small>{s.structured_formatting?.secondary_text}</small>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="campo-formulario">
                  <label>Referencia (opcional)</label>
                  <input
                    type="text"
                    placeholder="ej: Timbre 2, entre calles X e Y"
                    value={detalle.referencia}
                    onChange={e => setDetalle(prev => ({ ...prev, referencia: e.target.value }))}
                  />
                </div>

                <button type="submit" className="guardar-ubicacion">Guardar ubicación</button>
              </form>
            </div>
          </div>
        )}
        {editando && (
          <form onSubmit={guardarEdicion} className="formulario-ubicacion">
            <div className="campo-formulario">
              <label>Nombre</label>
              <input type="text" value={formEdicion.nombre} onChange={e => setFormEdicion(f => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div className="campo-formulario">
              <label>Tipo</label>
              <div className="tipos-ubicacion" role="radiogroup">
                {['casa', 'trabajo', 'otro'].map(tipo => (
                  <button
                    type="button"
                    key={tipo}
                    role="radio"
                    className={`tipo-btn ${formEdicion.tipo === tipo ? 'activo' : ''}`}
                    aria-checked={formEdicion.tipo === tipo}
                    onClick={() => setFormEdicion(f => ({ ...f, tipo }))}
                  >
                    {getIconoTipo(tipo)} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="campo-formulario">
              <label>Provincia</label>
              <select
                value={formEdicion.provincia}
                onChange={e => setFormEdicion(f => ({ ...f, provincia: e.target.value, ciudad: '', direccion: '' }))}
                required
                className="provincia-select formulario-input"
              >
                <option value="">Selecciona una provincia</option>
                {PROVINCIAS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="campo-formulario">
              <label>Ciudad</label>
              <select
                value={formEdicion.ciudad}
                onChange={e => setFormEdicion(f => ({ ...f, ciudad: e.target.value, direccion: '' }))}
                required
                className="ciudad-select formulario-input"
                disabled={!formEdicion.provincia || !CIUDADES[formEdicion.provincia]}
              >
                <option value="">Selecciona una ciudad</option>
                {(CIUDADES[formEdicion.provincia] || []).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="campo-formulario">
              <label>Dirección</label>
              <input
                type="text"
                value={formEdicion.direccion}
                onChange={e => setFormEdicion(f => ({ ...f, direccion: e.target.value }))}
                required
                className="formulario-input"
                disabled={!formEdicion.provincia || !formEdicion.ciudad}
              />
            </div>
            <div className="campo-formulario">
              <label>Referencia (opcional)</label>
              <input type="text" value={formEdicion.referencia} onChange={e => setFormEdicion(f => ({ ...f, referencia: e.target.value }))} />
            </div>
            <button type="submit" className="guardar-ubicacion">Guardar cambios</button>
            <button type="button" className="borrar-ubicacion-btn" onClick={() => setEditando(null)}>Cancelar</button>
          </form>
        )}
        {confirmarBorrado && (
          <div className="modal-confirmacion">
            <div className="modal-contenido">
              <h3>¿Seguro que quieres borrar esta ubicación?</h3>
              <div className="botones-confirmacion">
                <button className="btn-marron" onClick={() => { eliminarUbicacion(confirmarBorrado); setConfirmarBorrado(null); }}>Sí, borrar</button>
                <button className="btn-marron" onClick={() => setConfirmarBorrado(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </>
    ) : null;
  }

  return (
    <div className="selector-ubicacion" style={mobile ? { margin: '10px 0' } : {}}>
      {mobile ?
        <div className="ubicacion-principal" onClick={() => setMostrarModal(true)}>
          <FaMapMarkerAlt className="icono-ubicacion" />
          <div className="texto-ubicacion">
            {ubicacionActual ? (
                <span className="direccion-ubicacion"><span className="etiqueta-ubicacion">{ubicacionActual.nombre}</span>       {ubicacionActual.calle} {ubicacionActual.numero}</span>
            ) : <span className="sin-ubicacion">Seleccionar ubicación</span>}
          </div>
        </div>
        :
        <div className="ubicacion-principal" onClick={() => setMostrarModal(true)}>
          <FaMapMarkerAlt className="icono-ubicacion" />
          <div className="texto-ubicacion">
            {ubicacionActual ? (
              <>
                <span className="etiqueta-ubicacion">{ubicacionActual.nombre}</span>
                <span className="direccion-ubicacion">{ubicacionActual.calle} {ubicacionActual.numero}</span>
              </>
            ) : <span className="sin-ubicacion">Seleccionar ubicación</span>}
          </div>
        </div>
      }
      {mostrarModal && (
        <div className="modal-overlay fade-in" onClick={() => setMostrarModal(false)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Seleccionar ubicación</h2>
              <button className="cerrar-modal" onClick={() => setMostrarModal(false)}><FaTimes /></button>
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
                  <div className="ubicacion-icono">{getIconoTipo(ubicacion.tipo)}</div>
                  <div className="ubicacion-info">
                    <span className="ubicacion-nombre">{ubicacion.nombre}</span>
                    <span className="ubicacion-direccion">{ubicacion.calle} {ubicacion.numero}</span>
                    {ubicacion.referencia && <span className="ubicacion-referencia">{ubicacion.referencia}</span>}
                  </div>
                  <button
                    className="editar-ubicacion-btn btn-marron"
                    type="button"
                    onClick={e => { e.stopPropagation(); handleEditar(ubicacion); }}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="borrar-ubicacion-btn btn-marron"
                    type="button"
                    onClick={e => { e.stopPropagation(); setConfirmarBorrado(ubicacion._id); }}
                    title="Borrar"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="separador"><span>o agregar nueva ubicación</span></div>

            <form onSubmit={handleGuardar} className="formulario-ubicacion">
              <div className="campo-formulario">
                <label>Nombre</label>
                <input type="text" placeholder="ej: Casa de mamá" value={detalle.nombre} onChange={e => setDetalle(prev => ({ ...prev, nombre: e.target.value }))} required />
              </div>

              <div className="campo-formulario">
                <label>Tipo</label>
                <div className="tipos-ubicacion" role="radiogroup">
                  {['casa', 'trabajo', 'otro'].map(tipo => (
                    <button
                      type="button"
                      key={tipo}
                      role="radio"
                      className={`tipo-btn ${detalle.tipo === tipo ? 'activo' : ''}`}
                      aria-checked={detalle.tipo === tipo}
                      onClick={() => setDetalle(prev => ({ ...prev, tipo }))}
                    >
                      {getIconoTipo(tipo)} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="campo-formulario">
                <label>Dirección</label>
                <input
                  type="text"
                  placeholder="ej: Av. Mitre 1234, Tucumán"
                  value={direccion}
                  className={coordenadas ? 'is-valid' : 'is-invalid'}
                  onChange={e => {
                    setDireccion(e.target.value);
                    buscarSugerencias(e.target.value);
                    setCoordenadas(null);
                  }}
                  required
                />
                {direccion && <span className="clear-input" onClick={() => setDireccion('')}>×</span>}
                <div className="lista-sugerencias">
                  {cargandoSug ? <div className="spinner-autocomplete" /> :
                    sugerencias.map(s => (
                      <div
                        key={s.place_id}
                        className="item-sugerencia"
                        onClick={() => handleSelect(s.place_id, s.description)}
                      >
                        <strong>{s.structured_formatting?.main_text}</strong>{' '}
                        <small>{s.structured_formatting?.secondary_text}</small>
                      </div>
                    ))}
                </div>
              </div>

              <div className="campo-formulario">
                <label>Referencia (opcional)</label>
                <input
                  type="text"
                  placeholder="ej: Timbre 2, entre calles X e Y"
                  value={detalle.referencia}
                  onChange={e => setDetalle(prev => ({ ...prev, referencia: e.target.value }))}
                />
              </div>

              <button type="submit" className="guardar-ubicacion">Guardar ubicación</button>
            </form>
          </div>
        </div>
      )}
      {confirmarBorrado && (
        <div className="modal-confirmacion">
          <div className="modal-contenido">
            <h3>¿Seguro que quieres borrar esta ubicación?</h3>
            <div className="botones-confirmacion">
              <button className="btn-marron" onClick={() => { eliminarUbicacion(confirmarBorrado); setConfirmarBorrado(null); }}>Sí, borrar</button>
              <button className="btn-marron" onClick={() => setConfirmarBorrado(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectorUbicacion;
