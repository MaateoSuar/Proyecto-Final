import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UbicacionContext = createContext();

export const UbicacionProvider = ({ children }) => {
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [ubicacionesGuardadas, setUbicacionesGuardadas] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Función para obtener el token actual
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  // Función para crear la instancia de axios con el token actual
  const createApi = () => {
    const token = getToken();
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  };

  const obtenerUbicaciones = async () => {
    const token = getToken();
    
    if (!token) {
      setUbicacionesGuardadas([]);
      setUbicacionActual(null);
      return;
    }

    try {
      const api = createApi();
      const response = await api.get('/ubicaciones');
      setUbicacionesGuardadas(response.data);
      const ubicacionPredeterminada = response.data.find(u => u.predeterminada);
      setUbicacionActual(ubicacionPredeterminada || null);
      if (ubicacionPredeterminada) {
        localStorage.setItem('ubicacionSeleccionada', JSON.stringify(ubicacionPredeterminada));
      }
    } catch (error) {
      setUbicacionesGuardadas([]);
      setUbicacionActual(null);
      localStorage.removeItem('ubicacionSeleccionada');
    }
  };

  const guardarUbicacion = async (nuevaUbicacion) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para guardar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      const response = await api.post('/ubicaciones', nuevaUbicacion);
      setUbicacionesGuardadas([...ubicacionesGuardadas, response.data]);
      toast.success('Ubicación guardada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      toast.error(error.response?.data?.mensaje || 'Error al guardar la ubicación');
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
      setUbicacionesGuardadas(ubicacionesGuardadas.map(ub => 
        ub._id === id ? response.data : ub
      ));
      
      if (ubicacionActual?._id === id) {
        setUbicacionActual(response.data);
        localStorage.setItem('ubicacionSeleccionada', JSON.stringify(response.data));
      }
      
      toast.success('Ubicación actualizada correctamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar ubicación:', error);
      toast.error('Error al actualizar la ubicación');
      throw error;
    }
  };

  const eliminarUbicacion = async (id) => {
    const token = getToken();
    if (!token) {
      toast.error('Debes iniciar sesión para eliminar ubicaciones');
      throw new Error('No autenticado');
    }

    try {
      const api = createApi();
      await api.delete(`/ubicaciones/${id}`);
      setUbicacionesGuardadas(ubicacionesGuardadas.filter(ub => ub._id !== id));
      
      if (ubicacionActual?._id === id) {
        setUbicacionActual(null);
        localStorage.removeItem('ubicacionSeleccionada');
      }
      
      toast.success('Ubicación eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      toast.error('Error al eliminar la ubicación');
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
      setUbicacionesGuardadas(ubicacionesGuardadas.map(ub => ({
        ...ub,
        predeterminada: ub._id === ubicacion._id
      })));
      
      localStorage.setItem('ubicacionSeleccionada', JSON.stringify(ubicacion));
      toast.success('Ubicación seleccionada correctamente');
    } catch (error) {
      console.error('Error al seleccionar ubicación:', error);
      toast.error('Error al seleccionar la ubicación');
    }
  };

  // Efecto para cargar ubicaciones cuando cambia el token
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getToken();
      if (token) {
        obtenerUbicaciones();
      } else {
        setUbicacionesGuardadas([]);
        setUbicacionActual(null);
        localStorage.removeItem('ubicacionSeleccionada');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const token = localStorage.getItem('token');
    if (token) {
      obtenerUbicaciones();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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