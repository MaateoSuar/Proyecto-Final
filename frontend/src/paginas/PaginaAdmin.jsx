import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/admin.css';

export default function PaginaAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

  useEffect(() => {
    console.log('API_URL:', API_URL);
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios
      console.log('Intentando cargar usuarios...');
      const respUsuarios = await fetch(`${API_URL}/api/auth/users`);
      console.log('Respuesta usuarios:', respUsuarios);
      
      const dataUsuarios = await respUsuarios.json();
      console.log('Datos usuarios recibidos:', dataUsuarios);
      
      if (!respUsuarios.ok) {
        throw new Error(dataUsuarios.message || 'Error al cargar usuarios');
      }
      
      if (dataUsuarios.success) {
        setUsuarios(dataUsuarios.data || []);
      } else {
        setUsuarios([]);
        console.warn('No se encontraron usuarios');
      }

      // Cargar prestadores
      console.log('Intentando cargar prestadores...');
      const respPrestadores = await fetch(`${API_URL}/api/prestadores`);
      console.log('Respuesta prestadores:', respPrestadores);
      
      const dataPrestadores = await respPrestadores.json();
      console.log('Datos prestadores recibidos:', dataPrestadores);
      
      if (!respPrestadores.ok) {
        throw new Error(dataPrestadores.message || 'Error al cargar prestadores');
      }
      
      setPrestadores(dataPrestadores.data || []);

    } catch (error) {
      console.error('Error detallado:', error);
      toast.error(`Error al cargar los datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleEstadoPrestador = async (prestadorId, estadoActual) => {
    try {
      const response = await fetch(`${API_URL}/api/prestadores/${prestadorId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !estadoActual })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar estado');
      }

      setPrestadores(prev =>
        prev.map(p =>
          p._id === prestadorId ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(`Prestador ${!estadoActual ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error(error.message);
    }
  };

  const eliminarUsuario = async (userId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar usuario');
      }

      setUsuarios(prev => prev.filter(u => u._id !== userId));
      toast.success('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error(error.message);
    }
  };

  const eliminarPrestador = async (prestadorId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este prestador?')) return;

    try {
      const response = await fetch(`${API_URL}/api/prestadores/${prestadorId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al eliminar prestador');
      }

      setPrestadores(prev => prev.filter(p => p._id !== prestadorId));
      toast.success('Prestador eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar prestador:', error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </header>

      <section className="admin-section">
        <h2>Usuarios Consumidores ({usuarios.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map(usuario => (
                  <tr key={usuario._id}>
                    <td>{usuario.fullName}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.phone || 'N/A'}</td>
                    <td>{usuario.address || 'N/A'}</td>
                    <td>
                      <button 
                        onClick={() => eliminarUsuario(usuario._id)}
                        className="delete-button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No hay usuarios consumidores registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <h2>Prestadores de Servicios ({prestadores.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Servicios</th>
                <th>Rating</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestadores.length > 0 ? (
                prestadores.map(prestador => (
                  <tr key={prestador._id}>
                    <td>{prestador.name}</td>
                    <td>{prestador.email}</td>
                    <td>{prestador.services?.map(s => s.type).join(', ') || 'N/A'}</td>
                    <td>{prestador.rating?.average || 'N/A'}</td>
                    <td>{prestador.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => toggleEstadoPrestador(prestador._id, prestador.isActive)}
                          className={prestador.isActive ? 'deactivate-button' : 'activate-button'}
                        >
                          {prestador.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          onClick={() => eliminarPrestador(prestador._id)}
                          className="delete-button"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No hay prestadores de servicios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 