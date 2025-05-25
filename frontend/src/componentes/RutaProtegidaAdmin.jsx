import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const RutaProtegidaAdmin = ({ children }) => {
  // Obtener el usuario del localStorage
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  useEffect(() => {
    if (!usuario || usuario.email !== 'admin@admin.com') {
      toast.error('¡Acceso Denegado! No tienes permisos de administrador.');
    }
  }, [usuario]);

  // Verificar si el usuario está logueado y es admin@admin.com
  if (!usuario || usuario.email !== 'admin@admin.com') {
    // Redirigir a inicio
    return <Navigate to="/inicio" replace />;
  }

  // Si es admin, mostrar el contenido protegido
  return children;
};

export default RutaProtegidaAdmin; 