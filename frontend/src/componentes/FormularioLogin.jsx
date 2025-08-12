import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/login.css';
import { emitTokenChange } from '../context/UbicacionContext';

export default function FormularioLogin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Si viene un token en la URL (login con Google)
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Obtener perfil del usuario
      fetch(`${API_URL}/auth/perfil`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem('usuario', JSON.stringify(data));
          emitTokenChange();
          window.location.href = '/inicio';
        });
    }
  }, []);

  const alternarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      toast.warning('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true); // 👉 Activar loading

    try {
      const respuesta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correo,
          password: contrasena,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.msg || 'Credenciales inválidas');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      emitTokenChange();
      toast.success('¡Inicio de sesión exitoso!');

      navigate(correo === 'admin@admin.com' ? '/admin' : '/inicio');
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false); // 👉 Desactivar loading
    }
  };

  return (
    <div className="contenedor-login">
      <h1>PetCare</h1>
      <h2>Iniciar sesión</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleLogin}>
        <div className="grupo-formulario">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            className="input-contrasena"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="grupo-formulario">
          <label htmlFor="contrasena">Contraseña</label>
          <div className="envoltura-contrasena">
            <input
              type={mostrarContrasena ? 'text' : 'password'}
              id="contrasena"
              className="input-contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <span className="monito" onClick={alternarContrasena}>
              {mostrarContrasena ? '🙉' : '🙈'}
            </span>
          </div>
        </div>

        <div className="olvide-contrasena">¿Olvidaste tu contraseña?</div>

        <button className="boton-login" type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : 'Ingresar'}
        </button>
      </form>

      <div className="divisor"></div>

      <div className="crear-cuenta">
        ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
      </div>
      <div className="crear-cuenta">
        ¿Sos cuidador? <Link to="/login-cuidador">Iniciar sesión como prestador</Link>
      </div>
    </div>
  );
}
