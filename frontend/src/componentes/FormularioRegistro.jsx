// src/componentes/FormularioRegistro.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/registro.css';

export default function FormularioRegistro() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [formulario, setFormulario] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formulario.password !== formulario.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formulario.fullName,
          email: formulario.email,
          password: formulario.password,
        }),
      });
  
      const data = await respuesta.json();
  
      if (!respuesta.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }
  
      // GUARDAR EN LOCALSTORAGE
      localStorage.setItem(
        'usuario',
        JSON.stringify({ fullName: formulario.fullName })
      );
  
      toast.success('¡Cuenta creada con éxito! 🎉', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      navigate('/login');
    } catch (error) {
      toast.error('Error en el registro: ' + error.message);
    }
  };
  

  return (
    <div className="contenedor-login">
      <h1>PetCare</h1>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="grupo-formulario">
          <label htmlFor="fullName">Nombre completo</label>
          <div className="envoltura-input">
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Nombre completo"
              value={formulario.fullName}
              onChange={handleChange}
              required
            />
            <span className="espaciador"></span>
          </div>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="email">Correo electrónico</label>
          <div className="envoltura-input">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="PetCare@gmail.com"
              value={formulario.email}
              onChange={handleChange}
              required
            />
            <span className="espaciador"></span>
          </div>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="password">Contraseña</label>
          <div className="envoltura-input">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="**********"
              className="input-contrasena"
              value={formulario.password}
              onChange={handleChange}
              required
            />
            <span
              className="monito"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? '🙉' : '🙈'}
            </span>
          </div>
        </div>

        <div className="grupo-formulario">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="envoltura-input">
            <input
              type={mostrarConfirmar ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="**********"
              className="input-contrasena"
              value={formulario.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="monito"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
            >
              {mostrarConfirmar ? '🙉' : '🙈'}
            </span>
          </div>
        </div>

        <button type="submit" className="boton-login">Registrarse</button>
      </form>

      <div className="login-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </div>
    </div>
  );
}
