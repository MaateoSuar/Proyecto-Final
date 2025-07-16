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
      
      // Emitir evento de cambio de token para que UbicacionContext cargue ubicaciones
      emitTokenChange();

      toast.success('¡Inicio de sesión exitoso!');
      
      // Redirigir según el email
      if (correo === 'admin@admin.com') {
        navigate('/admin');
      } else {
        navigate('/inicio');
      }

    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Aquí irá la lógica de Google Sign-In
    window.location.href = `${API_URL}/auth/google`;
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

        <button className="boton-login" type="submit">
          Ingresar
        </button>
      </form>

      <div style={{ textAlign: 'center', margin: '18px 0 0 0', fontWeight: 500, color: '#875e39' }}>o</div>
      <button
        className="google-login-btn"
        style={{
          width: '100%',
          margin: '16px 0 0 0',
          background: '#fff',
          color: '#444',
          border: '1px solid #ddd',
          borderRadius: 6,
          padding: '10px 0',
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          cursor: 'pointer',
        }}
        onClick={handleGoogleLogin}
      >
        <img
          src="/img/google.png"
          alt="Google"
          style={{ width: 22, height: 22, marginRight: 10 }}
        />
        Iniciar sesión con Google
      </button>

      <div className="divisor"></div>

      <div className="crear-cuenta">
        ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
      </div>
    </div>
  );
}
