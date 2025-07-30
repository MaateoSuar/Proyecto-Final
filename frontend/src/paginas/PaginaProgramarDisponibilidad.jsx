import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPrestador from '../componentes/HeaderPrestador';
import ProgramarDisponibilidad from '../componentes/ProgramarDisponibilidad';
import '../estilos/PaginaProgramarDisponibilidad.css';

export default function PaginaProgramarDisponibilidad() {
  const navigate = useNavigate();

  const volverAlDashboard = () => {
    navigate('/cuidador/inicio');
  };

  return (
    <div className="pagina-programar-disponibilidad">
      <div className="header-container">
        <HeaderPrestador />
      </div>
      <div className="content-container">
        <div className="volver-container">
          <button 
            className="btn-volver"
            onClick={volverAlDashboard}
          >
            ← Volver al Dashboard
          </button>
        </div>
        <ProgramarDisponibilidad />
      </div>
      <div className="footer">
        Amá a tus mascotas con PetCare <span>❤️</span>
      </div>
    </div>
  );
} 