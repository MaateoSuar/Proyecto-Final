// src/componentes/FormularioLogin.jsx
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

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const respuesta = await fetch('http://localhost:5000/api/auth/login', {
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
        throw new Error(data.message || 'Credenciales inválidas');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
  
      // Acá podrías guardar el token si tu backend lo envía
      navigate('/inicio');
      console.log('Token:', data.token);
  
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
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
            placeholder="****"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <span className="toggle-password" onClick={alternarContrasena}>
            {mostrarContrasena ? '🙉' : '🙈'}
          </span>
        </div>
      </div>

      <div className="olvide-contrasena">¿Olvidaste tu contraseña?</div>

      <button className="boton-login" onClick={handleLogin}>
        Ingresar
      </button>

      <div className="divisor"></div>

      <div className="crear-cuenta">
        ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
      </div>
    </div>
  );
}