// reservar.js
import axios from 'axios';
const API_URL = process.env.VITE_API_URL;
export async function guardarReserva({
  proveedorId,
  mascotaId,
  dia,
  hora,
  token,
  cargarReservas,
  setIsLoading,
  setSelectedTime,
  setMascotaSeleccionada,
  setSelectedDate,
  proveedor,
  setProveedor,
  toast,
  navigate
}) {
  setIsLoading(true);

  try {
    const resReserva = await axios.post(
      `${API_URL}/reservas`,
      {
        provider: proveedorId,
        pet: mascotaId,
        date: dia,
        time: hora
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (resReserva.status === 201) {
      await axios.put(
        `${API_URL}/prestadores/${proveedorId}/availability`,
        { day: dia, slot: hora },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await cargarReservas();

      const nuevaDisponibilidad = proveedor.availability
        .map(a => {
          if (a.day.toLowerCase() === dia) {
            const nuevosSlots = a.slots.filter(h => h !== hora);
            return nuevosSlots.length > 0 ? { ...a, slots: nuevosSlots } : null;
          }
          return a;
        })
        .filter(Boolean);

      setProveedor(prev => ({
        ...prev,
        availability: nuevaDisponibilidad
      }));

      setSelectedTime(null);
      setMascotaSeleccionada('');
      setSelectedDate(null);

      toast.success(`✅ Reserva confirmada con proveedor el ${dia} a las ${hora}`);
    }
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
      navigate('/login');
    } else if (err.response?.status === 404) {
      toast.error('El proveedor o la mascota seleccionada no fueron encontrados');
    } else if (err.response?.status === 400) {
      toast.error(err.response.data.message || 'Datos de reserva inválidos');
    } else {
      toast.error('Ocurrió un error al realizar la reserva. Por favor, intenta nuevamente.');
    }
  } finally {
    setIsLoading(false);
  }
}
