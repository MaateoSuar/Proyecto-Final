import UsuarioEdit from '../componentes/UsuarioEdit';
import MisReservas from '../componentes/MisReservas';
import { useState, useEffect } from 'react';
import BotonVolver from '../componentes/BotonVolver';
import '../estilos/PaginaUsuario.css';
import { useNavigate, useLocation } from 'react-router-dom';
import SelectorUbicacion from '../componentes/SelectorUbicacion';
import { io } from 'socket.io-client';

export default function PaginaUsuario() {
  const BACK_URL = import.meta.env.VITE_BACK_URL;
  const location = useLocation();
  function getTabFromQuery() {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'reservas' ? 'reservas' : 'perfil';
  }
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState(getTabFromQuery());
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('usuario'))?.id;

    if (!userId || !token) return;

    const newSocket = io(`${BACK_URL}`, {
      auth: { token },
    });

    window.socket = newSocket;
    newSocket.emit('joinSala', userId);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
      <BotonVolver />
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
            👤 Perfil
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
            🚪 Cerrar Sesión
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
        {activeTab === 'perfil' ? (
          <div className="perfil-contenedor">
            <div className="avatar-centro-movil">
              <UsuarioEdit isEditMode={isEditMode} />
            </div>
            {/* Botones móviles abajo, dentro del contenedor blanco */}
            {!isEditMode && (
              <div className="perfil-botones-movil">
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
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'reservas' ? (
          <MisReservas />
        ) : null}
        {/* Montamos SelectorUbicacion oculto para que el modal funcione pero sin mostrar el recuadro */}
        <SelectorUbicacion oculto={true} />
      </div>
    </div>
  );
}