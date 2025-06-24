// servicios/ubicacionService.js
import axios from 'axios';

export async function guardarUbicacion(ubicacion) {
  // Hace un POST a tu backend para guardar la ubicación
  const response = await axios.post('/api/ubicaciones', ubicacion);
  return response.data; // devuelve el objeto guardado que responde el backend
}
