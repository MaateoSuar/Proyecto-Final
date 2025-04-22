import axios from 'axios';

const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const iniciarSesion = async (correo, contrasena) => {
  const respuesta = await axios.post(`${URL_API}/auth/login`, {
    email: correo,
    password: contrasena,
  });
  return respuesta.data;
};