import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/BotonVolver.css';

const BotonVolver = ({ className = '', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      className={`boton-volver-responsive ${className}`}
      onClick={handleClick}
      aria-label="Volver atrás"
    >
      &larr;
    </button>
  );
};

export default BotonVolver; 