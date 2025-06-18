import UsuarioEdit from '../componentes/UsuarioEdit';
import MisReservas from '../componentes/MisReservas';
import { useState } from 'react';
import '../estilos/PaginaUsuario.css';
import { useNavigate } from 'react-router-dom';

export default function PaginaUsuario() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="pagina-usuario">
      <button
        className="back-button"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'var(--background)',
          color: '#8B5C2A',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: 'none',
          zIndex: 10
        }}
        onClick={() => navigate('/inicio')}
      >
        ← Atrás
      </button>
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservas' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservas')}
        >
        Reservas
        </button>
        <button 
          className="tab-button cerrar-sesion"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>

        {activeTab === 'perfil' && (
        <button className="tab-button edit-button" 
              onClick={() => setIsEditMode(!isEditMode)}
              title={isEditMode ? "Cerrar edición" : "Editar perfil"}>
          {isEditMode ? '❌' : '✏️'}
        </button>
        )}

        
      </div>
      
      <div className="tab-content">
        {activeTab === 'perfil' && (
          <div className="perfil-contenedor">
            <UsuarioEdit isEditMode={isEditMode} />
          </div>
        )}

        {activeTab === 'reservas' && (
          <MisReservas />
        )}
      </div>
    </div>
  );
}

