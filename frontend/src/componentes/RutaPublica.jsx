import { Navigate } from 'react-router-dom';

const RutaPublica = ({ children }) => {
  const token = localStorage.getItem('token');
  const prestador = localStorage.getItem('prestador');
  const usuario = localStorage.getItem('usuario');

  if (token && usuario) {
    return <Navigate to="/inicio" replace />;
  }
  if (token && prestador) {
    return <Navigate to="/cuidador/inicio" replace />;
  }

  return children;
};

export default RutaPublica; 