import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../estilos/login.css';

export default function FormularioLogin() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const alternarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const manejarLogin = () => {
    if (!correo || !contrasena) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Simular autenticación
    const usuario = {
      nombre: 'Juan', // Puedes reemplazar esto cuando conectes con el backend
      correo: correo
    };

    // Guardar usuario en localStorage
    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Redirigir a página principal
    navigate('/inicio');
  };

  return (
    <div className="contenedor-login">
      <h1>PetCare</h1>
      <h2>Iniciar sesión</h2>

      <div className="grupo-formulario">
        <label htmlFor="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          placeholder="PetCare@gmail.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>

      <div className="grupo-formulario">
        <label htmlFor="contrasena">Contraseña</label>
        <div className="envoltura-contrasena">
          <input
            type={mostrarContrasena ? 'text' : 'password'}
            id="contrasena"
            className="input-contrasena"
            placeholder="**********"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <span className="toggle-password" onClick={alternarContrasena}>
            {mostrarContrasena ? '🙉' : '🙈'}
          </span>
        </div>
      </div>

      <div className="olvide-contrasena">¿Olvidaste tu contraseña?</div>

      <button className="boton-login" onClick={manejarLogin}>
        Ingresar
      </button>

      <div className="divisor"></div>

      <div className="crear-cuenta">
        ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
      </div>
    </div>
  );
}
