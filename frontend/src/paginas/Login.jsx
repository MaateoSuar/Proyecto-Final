import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { emitTokenChange } from '../context/UbicacionContext';
import '../estilos/login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Efecto para limpiar el historial cuando el componente se monta
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al iniciar sesión');
      }

      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      // Emitir evento de cambio de token y esperar un momento
      emitTokenChange();
      
      // Esperar un momento para que el contexto procese el evento
      await new Promise(resolve => setTimeout(resolve, 100));

      toast.success('Inicio de sesión exitoso');

      // Limpiar el historial antes de navegar
      window.history.pushState(null, '', window.location.pathname);
      
      // Redirigir según el tipo de usuario y reemplazar la entrada en el historial
      if (data.usuario.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
      }

      // Prevenir el uso del botón atrás
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', () => {
        window.history.pushState(null, '', window.location.pathname);
      });

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
} 