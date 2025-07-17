// Utilidades para manejar estados de reserva

// Definición de estados (frontend)
export const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  ACEPTADA: 'aceptada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

// Mapa de estados backend -> frontend
const ESTADO_MAP = {
  'pendiente': 'Pendiente',
  'aceptada': 'Confirmada',
  'completada': 'Completada',
  'cancelada': 'Cancelada'
};

// Función para obtener el texto del estado
export const getEstadoText = (status) => {
  return ESTADO_MAP[status] || status?.charAt(0).toUpperCase() + status?.slice(1) || 'Desconocido';
};

// Función para obtener el mensaje según el estado
export const getEstadoMessage = (status) => {
  switch (status) {
    case ESTADOS_RESERVA.PENDIENTE:
      return 'Tu reserva está siendo revisada por el proveedor';
    case ESTADOS_RESERVA.CONFIRMADA:
      return '¡Tu reserva fue confirmada! Prepárate para el servicio';
    case ESTADOS_RESERVA.COMPLETADA:
      return 'Servicio completado. ¡Gracias por confiar en nosotros!';
    case ESTADOS_RESERVA.CANCELADA:
      return 'Esta reserva fue cancelada';
    case 'aceptada': // Ajuste para compatibilidad con backend
      return '¡Tu reserva fue confirmada! Prepárate para el servicio';
    default:
      return '';
  }
};

// Función para verificar si una reserva puede ser cancelada
export const puedeCancelar = (status) => {
  return status === ESTADOS_RESERVA.PENDIENTE || status === ESTADOS_RESERVA.ACEPTADA;
};

// Función para verificar si una reserva puede ser valorada
export const puedeValorar = (reserva) => {
  return reserva.status === ESTADOS_RESERVA.COMPLETADA && 
         !reserva.comment && 
         !reserva.rating;
};

// Función para verificar si una reserva ya fue valorada
export const yaFueValorada = (reserva) => {
  return reserva.status === ESTADOS_RESERVA.COMPLETADA && 
         reserva.comment && 
         reserva.rating;
};
