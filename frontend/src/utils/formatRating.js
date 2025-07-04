// Devuelve el rating con un decimal o 'N/A' si no es válido
export default function formatRating(rating) {
  if (typeof rating !== 'number' || isNaN(rating)) return 'N/A';
  return rating.toFixed(1);
}