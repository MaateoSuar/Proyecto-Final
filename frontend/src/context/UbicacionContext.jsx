import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Crear un evento personalizado para cambios de token
const TOKEN_CHANGE_EVENT = 'tokenChange';

const UbicacionContext = createContext();

export const UbicacionProvider = ({ children }) => {
  const [ubicacionActual, setUbicacionActual] = useState(() => {
    const savedLocation = localStorage.getItem('ubicacionSeleccionada');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });
  const [ubicacionesGuardadas, setUbicacionesGuardadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Función para obtener el token actual
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  // Función para crear la instancia de axios con el token actual
  const createApi = useCallback(() => {
    const token = getToken();
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  }, []);

  const obtenerUbicaciones = useCallback(async () => {
    const token = getToken();
    
    if (!token) {
      setUbicacionesGuardadas([]);
      setUbicacionActual(null);
      localStorage.removeItem('ubicacionSeleccionada');
      setCargando(false);
      return;
    }

    try {
      setCargando(true);
      const api = createApi();
      const response = await api.get('/ubicaciones');
      const ubicaciones = response.data;
      setUbicacionesGuardadas(ubicaciones);

      // Buscar la ubicación predeterminada
      const ubicacionPredeterminada = ubicaciones.find(u => u.predeterminada);
      
      if (ubicacionPredeterminada) {
        setUbicacionActual(ubicacionPredeterminada);
        localStorage.setItem('ubicacionSeleccionada', JSON.stringify(ubicacionPredeterminada));
      } else {
        // Si no hay ubicación predeterminada, intentar mantener la ubicación actual si existe en las ubicaciones guardadas
        const ubicacionActualGuardada = ubicaciones.find(u => u._id === ubicacionActual?._id);
        if (ubicacionActualGuardada) {
          setUbicacionActual(ubicacionActualGuardada);
          localStorage.setItem('ubicacionSeleccionada', JSON.stringify(ubicacionActualGuardada));
        } else {
          setUbicacionActual(null);
          localStorage.removeItem('ubicacionSeleccionada');
        }
      }
    } catch (error) {
      setUbicacionesGuardadas([]);
      setUbicacionActual(null);
      localStorage.removeItem('ubicacionSeleccionada');
      toast.error('Error al cargar las ubicaciones');
    } finally {
      setCargando(false);
    }
  }, [createApi]);

  const guardarUbicacion = async (nuevaUbicacion) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para guardar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      const response = await api.post('/ubicaciones', nuevaUbicacion);
      setUbicacionesGuardadas(prev => [...prev, response.data]);
      toast.success('Ubicación guardada correctamente');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar la ubicación');
      throw error;
    }
  };

  const eliminarUbicacion = async (ubicacionId) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para eliminar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      await api.delete(`/ubicaciones/${ubicacionId}`);
      setUbicacionesGuardadas(prev => prev.filter(u => u._id !== ubicacionId));
      
      // Si la ubicación eliminada era la actual, la removemos
      if (ubicacionActual?._id === ubicacionId) {
        setUbicacionActual(null);
        localStorage.removeItem('ubicacionSeleccionada');
      }
      
      toast.success('Ubicación eliminada correctamente');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al eliminar la ubicación');
      throw error;
    }
  };

  const actualizarUbicacion = async (id, datosUbicacion) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para actualizar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      const response = await api.put(`/ubicaciones/${id}`, datosUbicacion);
      setUbicacionesGuardadas(prev => 
        prev.map(ub => ub._id === id ? response.data : ub)
      );
      
      if (ubicacionActual?._id === id) {
        setUbicacionActual(response.data);
        localStorage.setItem('ubicacionSeleccionada', JSON.stringify(response.data));
      }
      
      toast.success('Ubicación actualizada correctamente');
      return response.data;
    } catch (error) {
      toast.error('Error al actualizar la ubicación');
      throw error;
    }
  };

  const seleccionarUbicacion = async (ubicacion) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para seleccionar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      await api.patch(`/ubicaciones/${ubicacion._id}/predeterminada`);
      
      setUbicacionActual(ubicacion);
      setUbicacionesGuardadas(prev => prev.map(ub => ({
        ...ub,
        predeterminada: ub._id === ubicacion._id
      })));
      
      localStorage.setItem('ubicacionSeleccionada', JSON.stringify(ubicacion));
      toast.success('Ubicación seleccionada correctamente');
    } catch (error) {
      toast.error('Error al seleccionar la ubicación');
    }
  };

  // Efecto para cargar ubicaciones cuando cambia el token
  useEffect(() => {
    const handleTokenChange = () => {
      const token = getToken();
      if (token) {
        obtenerUbicaciones();
      } else {
        setUbicacionesGuardadas([]);
        setUbicacionActual(null);
        localStorage.removeItem('ubicacionSeleccionada');
        setCargando(false);
      }
    };

    // Escuchar cambios de token tanto del storage como del evento personalizado
    window.addEventListener('storage', handleTokenChange);
    window.addEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);

    // Cargar ubicaciones iniciales si hay token
    const token = localStorage.getItem('token');
    if (token) {
      obtenerUbicaciones();
    } else {
      setCargando(false);
    }

    return () => {
      window.removeEventListener('storage', handleTokenChange);
      window.removeEventListener(TOKEN_CHANGE_EVENT, handleTokenChange);
    };
  }, [obtenerUbicaciones]);

  return (
    <UbicacionContext.Provider 
      value={{
        ubicacionActual,
        ubicacionesGuardadas,
        cargando,
        seleccionarUbicacion,
        guardarUbicacion,
        actualizarUbicacion,
        eliminarUbicacion,
        obtenerUbicaciones
      }}
    >
      {children}
    </UbicacionContext.Provider>
  );
};

export const useUbicacion = () => {
  const context = useContext(UbicacionContext);
  if (!context) {
    throw new Error('useUbicacion debe ser usado dentro de un UbicacionProvider');
  }
  return context;
};

// Exportar la función emitTokenChange como una función separada
export const emitTokenChange = () => {
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
}; 