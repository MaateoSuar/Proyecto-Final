import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/login.css';

export default function FormularioLoginCuidador() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const navigate = useNavigate();

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
      const respuesta = await fetch(`${API_URL}/auth/login-cuidador`, {
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
      localStorage.setItem('prestador', JSON.stringify(data.prestador));

      toast.success('¡Inicio de sesión exitoso como cuidador!');
      navigate('/cuidador/inicio');

    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="contenedor-login">
      <h1>PetCare<span className="r">r</span></h1>
      <h2>Iniciar sesión como prestador</h2>

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

      <div className="divisor"></div>
      <div className="crear-cuenta">
        ¿Querés empezar a ofrecer tus servicios? <Link to="/registro-cuidador">Registrarse como prestador</Link>
      </div>
      <div className="crear-cuenta">
        ¿No sos prestador? <Link to="/login">Iniciar sesión como usuario</Link>
      </div>
    </div>
  );
}
