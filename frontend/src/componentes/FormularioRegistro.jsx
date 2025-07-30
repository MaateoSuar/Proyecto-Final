// src/componentes/FormularioRegistro.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../estilos/registro.css';
import countries from '../utils/countries';

export default function FormularioRegistro() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [formulario, setFormulario] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
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
          country: formulario.country,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.message || 'Error al registrarse');
      }

      // GUARDAR EN LOCALSTORAGE
      localStorage.setItem(
        'usuario',
        JSON.stringify({ firstName: formulario.firstName, lastName: formulario.lastName })
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
    <div className="registro-pagina">
      <div className="registro-contenedor">
        <h1>PetCare</h1>
        <h2>Registro de usuarios</h2>
        <form onSubmit={handleSubmit} className="registro-formulario">
          <div className="registro-columnas">
            <div className="registro-columna-izquierda">
              <div className="registro-grupo">
                <label htmlFor="name">Nombre completo</label>
                <div className="registro-input-wrap">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Nombre completo"
                    value={formulario.fullName}
                    onChange={handleChange}
                    required
                  />
                  <span className="registro-espaciador"></span>
                </div>
              </div>

              <div className="registro-grupo">
                <label htmlFor="email">Correo electrónico</label>
                <div className="registro-input-wrap">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="usuario@petcare.com"
                    value={formulario.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="registro-espaciador"></span>
                </div>
              </div>
            </div>

            <div className="registro-columna-derecha">
              <div className="registro-grupo">
                <label htmlFor="password">Contraseña</label>
                <div className="registro-input-wrap">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="**********"
                    className="registro-input-contra"
                    value={formulario.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="registro-monito"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                  >
                    {mostrarPassword ? '🙉' : '🙈'}
                  </span>
                </div>
              </div>

              <div className="registro-grupo">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="registro-input-wrap">
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="**********"
                    className="registro-input-contra"
                    value={formulario.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="registro-monito"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  >
                    {mostrarConfirmar ? '🙉' : '🙈'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="registro-boton">Registrarse</button>
        </form>

        <div className="registro-login-link">
          ¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
