import { Navigate } from 'react-router-dom';

const RutaPublica = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default RutaPublica; 