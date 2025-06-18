import UsuarioEdit from '../componentes/UsuarioEdit';
import MisReservas from '../componentes/MisReservas';
import { useState, useEffect } from 'react';
import '../estilos/PaginaUsuario.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaginaUsuario() {
  const location = useLocation();
  function getTabFromQuery() {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'reservas' ? 'reservas' : 'perfil';
  }
  const [activeTab, setActiveTab] = useState(getTabFromQuery());
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(getTabFromQuery());
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, location.search]);

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
          onClick={() => {
            setActiveTab('perfil');
            navigate('/profile?tab=perfil');
          }}
        >
          Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservas' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('reservas');
            navigate('/profile?tab=reservas');
          }}
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

