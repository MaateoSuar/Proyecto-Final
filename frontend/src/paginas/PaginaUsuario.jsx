import UsuarioEdit from '../componentes/UsuarioEdit';
import MisReservas from '../componentes/MisReservas';
import { useState, useEffect } from 'react';
import '../estilos/PaginaUsuario.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SelectorUbicacion from '../componentes/SelectorUbicacion';

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

  useEffect(() => {
    const handleToggleEditMode = () => {
      setIsEditMode(!isEditMode);
    };

    window.addEventListener('toggleEditMode', handleToggleEditMode);
    return () => {
      window.removeEventListener('toggleEditMode', handleToggleEditMode);
    };
  }, [isEditMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="pagina-usuario">
      {/* Barra lateral */}
      <div className="sidebar">
        {/* Botón de regreso */}
      <button
          className="back-button-sidebar"
        onClick={() => navigate('/inicio')}
      >
        <span className="back-arrow">&larr;</span>
      </button>

        {/* Menú principal */}
        <div className="sidebar-menu">
        <button 
            className={`sidebar-item ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('perfil');
            navigate('/profile?tab=perfil');
          }}
        >
          Perfil
        </button>
          
        <button 
            className={`sidebar-item ${activeTab === 'reservas' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('reservas');
            navigate('/profile?tab=reservas');
          }}
        >
            📅 Reservas
        </button>
          
        <button 
            className="sidebar-item logout"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
        </div>

        {/* Enlaces adicionales */}
        <div className="sidebar-links">
          <div className="sidebar-link">PetCare®</div>
          <div className="sidebar-link" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</div>
          <div className="sidebar-link" onClick={() => navigate('/contacto')}>Contacto</div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="main-content">
        {activeTab === 'perfil' && (
          <div className="perfil-contenedor">
            <div className="avatar-centro-movil">
              <UsuarioEdit isEditMode={isEditMode} />
            </div>
          </div>
        )}

        {activeTab === 'reservas' && (
          <MisReservas />
        )}
      </div>
      
      {/* Montamos SelectorUbicacion oculto para que el modal funcione pero sin mostrar el recuadro */}
      <SelectorUbicacion oculto={true} />
    </div>
  );
}