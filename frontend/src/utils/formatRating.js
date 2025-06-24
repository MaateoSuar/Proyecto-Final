// Devuelve el rating con un decimal o 'N/A' si no es válido
export default function formatRating(rating) {
  if (typeof rating !== 'number' || isNaN(rating)) return 'N/A';
  return rating.toFixed(1);
}

// Capitaliza la primera letra de un string
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Verifica si el rol es admin
export function isAdmin(role) {
  return role === 'admin';
}

// Devuelve el avatar o uno por defecto
export function getAvatar(url) {
  return url || 'default.png';
}

// Filtra mascotas por tipo
export function filterPets(pets, type) {
  return pets.filter(p => p.type === type);
}
