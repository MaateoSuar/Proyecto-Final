import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/admin.css';
import axios from 'axios';

export default function PaginaAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerDatos = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const [respUsuarios, respPrestadores] = await Promise.all([
          axios.get(`${API_URL}/auth/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/prestadores`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsuarios(respUsuarios.data.data || []);
        setPrestadores(respPrestadores.data.data || []);
      } catch (error) {
        toast.error('Error al cargar los datos');
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleEstadoPrestador = async (prestadorId, estadoActual, nombrePrestador) => {
    const accion = estadoActual ? 'desactivar' : 'activar';
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `${API_URL}/prestadores/${prestadorId}/toggle-status`,
        { isActive: !estadoActual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrestadores(prev =>
        prev.map(p =>
          p._id === prestadorId ? { ...p, isActive: !p.isActive } : p
        )
      );
      toast.success(`Prestador ${nombrePrestador} ${!estadoActual ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      toast.error(`Error al ${accion} prestador: ${error.response?.data?.message || 'Error desconocido'}`);
    }
  };

  const eliminarUsuario = async (userId, nombreUsuario) => {
    const toastId = toast.warn(
      <div>
        <p>¿Estás seguro de que deseas eliminar al usuario {nombreUsuario}?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/auth/usuarios/${userId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                setUsuarios(prev => prev.filter(u => u._id !== userId));
                toast.success(`Usuario ${nombreUsuario} eliminado exitosamente`);
              } catch (error) {
                toast.error(`Error al eliminar usuario: ${error.response?.data?.message || 'Error desconocido'}`);
              }
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Eliminar
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        closeButton: true
      }
    );
  };

  const eliminarPrestador = async (prestadorId, nombrePrestador) => {
    const toastId = toast.warn(
      <div>
        <p>¿Estás seguro de que deseas eliminar al prestador {nombrePrestador}?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/prestadores/${prestadorId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });

                setPrestadores(prev => prev.filter(p => p._id !== prestadorId));
                toast.success(`Prestador ${nombrePrestador} eliminado exitosamente`);
              } catch (error) {
                toast.error(`Error al eliminar prestador: ${error.response?.data?.message || 'Error desconocido'}`);
              }
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Eliminar
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: true,
        closeButton: true
      }
    );
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
                        onClick={() => eliminarUsuario(usuario._id, usuario.fullName)}
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
                          onClick={() => toggleEstadoPrestador(prestador._id, prestador.isActive, prestador.name)}
                          className={prestador.isActive ? 'deactivate-button' : 'activate-button'}
                        >
                          {prestador.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          onClick={() => eliminarPrestador(prestador._id, prestador.name)}
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