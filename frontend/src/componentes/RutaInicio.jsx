// src/componentes/RutaInicio.jsx
import { Navigate } from 'react-router-dom';

export default function RutaInicio() {
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');
  const prestador = localStorage.getItem('prestador');

  if (token && prestador) {
    return <Navigate to="/cuidador/inicio" replace />;
  }

  if (token && usuario) {
    return <Navigate to="/inicio" replace />;
  }

  return <Navigate to="/login" replace />;
}
