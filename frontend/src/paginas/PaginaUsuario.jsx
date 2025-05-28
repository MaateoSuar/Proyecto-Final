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
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="pagina-usuario">
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

