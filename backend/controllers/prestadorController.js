// prestadorController.js
const Prestador = require('../models/Prestador');
const Reserva = require('../models/Reservation');
const Usuario = require('../models/Usuario');

// Obtener todos los prestadores con opción de filtrado
const getAllPrestadores = async (req, res) => {
    try {
        const prestadores = await Prestador.find({ isActive: true });

        res.json({
            success: true,
            data: prestadores,
            count: prestadores.length
        });
    } catch (error) {
        console.error('Error al obtener prestadores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los prestadores',
            error: error.message
        });
    }
};

const getHorariosDisponibles = async (req, res) => {
    const { prestadorId } = req.params;
    const { fecha } = req.query;

    if (!prestadorId || !fecha) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros: prestadorId o fecha' });
    }

    try {
        const prestador = await Prestador.findById(prestadorId);
        if (!prestador) {
            return res.status(404).json({ success: false, message: 'Prestador no encontrado' });
        }

        // Determinar el día de la semana
        const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const diaSemana = diasSemana[new Date(fecha).getDay()]; // ej: "martes"

        // Buscar disponibilidad para ese día
        const disponibilidad = prestador.availability.find(d => d.day.toLowerCase() === diaSemana);
        if (!disponibilidad) {
            return res.json({ success: true, data: [] }); // No trabaja ese día
        }

        // Buscar reservas ya tomadas para ese prestador en esa fecha
        const reservas = await Reserva.find({ provider: prestadorId, date: fecha });

        const horariosReservados = reservas.map(r => r.time);

        // Filtrar horarios disponibles
        const horariosDisponibles = disponibilidad.slots.filter(h => !horariosReservados.includes(h));
        
        res.json({
            success: true,
            data: horariosDisponibles
        });

    } catch (error) {
        console.error('Error al obtener horarios disponibles:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
};

// Crear múltiples prestadores
const createManyPrestadores = async (req, res) => {
    try {
        const prestadores = req.body.prestadores;

        if (!Array.isArray(prestadores)) {
            return res.status(400).json({
                success: false,
                message: 'El body debe contener un array de prestadores en la propiedad "prestadores"'
            });
        }

        const createdPrestadores = await Prestador.insertMany(prestadores);

        res.status(201).json({
            success: true,
            message: `${createdPrestadores.length} prestadores creados exitosamente`,
            data: createdPrestadores
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear los prestadores',
            error: error.message
        });
    }
};

const updateAvailability = async (req, res) => {
    try {
        const { proveedorId } = req.params;
        const { day, slot } = req.body;

        if (!proveedorId || !day || !slot) {
            return res.status(400).json({ success: false, message: `${proveedorId, day, slot}Faltan parámetros requeridos (providerId, day o slot).` });
        }

        const prestador = await Prestador.findById(proveedorId);
        if (!prestador) {
            return res.status(404).json({ success: false, message: 'Prestador no encontrado.' });
        }

        const dayEntry = prestador.availability.find(d => d.day === day);
        if (!dayEntry) {
            return res.status(400).json({ success: false, message: 'Día no encontrado en la disponibilidad del prestador.' });
        }

        const slotIndex = dayEntry.slots.indexOf(slot);
        if (slotIndex === -1) {
            return res.status(400).json({ success: false, message: 'Horario no encontrado en el día especificado.' });
        }

        // Eliminar el slot
        dayEntry.slots.splice(slotIndex, 1);

        // Si no quedan horarios, eliminar el día completo
        if (dayEntry.slots.length === 0) {
            prestador.availability = prestador.availability.filter(d => d.day !== day);
        }

        await prestador.save();

        return res.status(200).json({
            success: true,
            message: 'Disponibilidad actualizada correctamente.',
            availability: prestador.availability
        });

    } catch (error) {
        console.error('Error al actualizar disponibilidad:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Actualizar toda la disponibilidad del prestador
const updateFullAvailability = async (req, res) => {
    try {
        const { proveedorId } = req.params;
        const { availability } = req.body;

        if (!proveedorId) {
            return res.status(400).json({ success: false, message: 'Falta el ID del proveedor.' });
        }

        const prestador = await Prestador.findById(proveedorId);
        if (!prestador) {
            return res.status(404).json({ success: false, message: 'Prestador no encontrado.' });
        }

        // Validar que availability sea un array
        if (!Array.isArray(availability)) {
            return res.status(400).json({ success: false, message: 'La disponibilidad debe ser un array.' });
        }

        // Actualizar la disponibilidad completa
        prestador.availability = availability;

        await prestador.save();

        return res.status(200).json({
            success: true,
            message: 'Disponibilidad actualizada correctamente.',
            availability: prestador.availability
        });

    } catch (error) {
        console.error('Error al actualizar disponibilidad completa:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Actualizar servicios del prestador
const updateServices = async (req, res) => {
    try {
        const { proveedorId } = req.params;
        const { services } = req.body;

        if (!proveedorId) {
            return res.status(400).json({ success: false, message: 'Falta el ID del proveedor.' });
        }

        const prestador = await Prestador.findById(proveedorId);
        if (!prestador) {
            return res.status(404).json({ success: false, message: 'Prestador no encontrado.' });
        }

        // Validar que services sea un array
        if (!Array.isArray(services)) {
            return res.status(400).json({ success: false, message: 'Los servicios deben ser un array.' });
        }

        // Validar cada servicio
        for (const service of services) {
            if (!service.type || !service.price || service.price <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cada servicio debe tener un tipo válido y un precio mayor a 0.' 
                });
            }
        }

        // Actualizar los servicios
        prestador.services = services;

        await prestador.save();

        return res.status(200).json({
            success: true,
            message: 'Servicios actualizados correctamente.',
            services: prestador.services
        });

    } catch (error) {
        console.error('Error al actualizar servicios:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

// Activar/Desactivar prestador
const togglePrestadorStatus = async (req, res) => {
    try {
        const { prestadorId } = req.params;
        const { isActive } = req.body;

        const prestador = await Prestador.findById(prestadorId);
        if (!prestador) {
            return res.status(404).json({
                success: false,
                message: 'Prestador no encontrado'
            });
        }

        prestador.isActive = isActive;
        await prestador.save();

        res.json({
            success: true,
            message: `Prestador ${isActive ? 'activado' : 'desactivado'} correctamente`,
            data: prestador
        });
    } catch (error) {
        console.error('Error al actualizar estado del prestador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado del prestador',
            error: error.message
        });
    }
};

// Eliminar prestador
const deletePrestador = async (req, res) => {
    try {
        const { prestadorId } = req.params;
        const prestador = await Prestador.findByIdAndDelete(prestadorId);

        if (!prestador) {
            return res.status(404).json({
                success: false,
                message: 'Prestador no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Prestador eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar prestador:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar prestador',
            error: error.message
        });
    }
};

// GET /prestadores/:id/reviews
const getReviewsFromProvider = async (req, res) => {
  try {
    const prestador = await Prestador.findById(req.params.id).lean();

    if (!prestador || !prestador.reviews) {
      return res.status(404).json({ error: 'Prestador no encontrado o sin comentarios' });
    }

    const reviews = await Promise.all(
      prestador.reviews.map(async (review) => {
        const user = await Usuario.findById(review.userId).select('fullName email');
        return {
          ...review,
          user
        };
      })
    );

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reviews del prestador' });
  }
};

// Obtener un prestador por su ID
const getPrestadorById = async (req, res) => {
    try {
        const prestador = await Prestador.findById(req.params.id);
        if (!prestador) {
            return res.status(404).json({
                success: false,
                message: 'Prestador no encontrado'
            });
        }
        res.json({
            success: true,
            data: prestador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el prestador',
            error: error.message
        });
    }
};

module.exports = {
    getAllPrestadores,
    createManyPrestadores,
    updateAvailability,
    updateFullAvailability,
    updateServices,
    togglePrestadorStatus,
    deletePrestador,
    getPrestadorById,
    getHorariosDisponibles,
    getReviewsFromProvider
}; 