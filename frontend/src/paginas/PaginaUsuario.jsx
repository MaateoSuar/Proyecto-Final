import UsuarioEdit from '../componentes/UsuarioEdit';
import MisReservas from '../componentes/MisReservas';
import { useState } from 'react';
import '../estilos/PaginaUsuario.css';

export default function PaginaUsuario() {
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="pagina-usuario">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Mi Perfil
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservas' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservas')}
        >
          Mis Reservas
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'perfil' ? <UsuarioEdit /> : <MisReservas />}
      </div>
    </div>
  );
}
