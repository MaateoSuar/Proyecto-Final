const Prestador = require('../models/Prestador');

// Obtener todos los prestadores con opción de filtrado
const getAllPrestadores = async (req, res) => {
    try {
        const { tipoServicio } = req.query;
        let query = {};

        // Si se proporciona un tipo de servicio, filtrar prestadores que tengan ese servicio
        if (tipoServicio) {
            query['services'] = {
                $elemMatch: {
                    type: tipoServicio.toLowerCase()
                }
            };
        }

        const prestadores = await Prestador.find(query);

        if (!prestadores.length) {
            return res.status(404).json({
                success: false,
                message: tipoServicio
                    ? `No se encontraron prestadores que ofrezcan el servicio de ${tipoServicio}`
                    : 'No se encontraron prestadores'
            });
        }

        res.json({
            success: true,
            data: prestadores,
            count: prestadores.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los prestadores',
            error: error.message
        });
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

module.exports = {
    getAllPrestadores,
    createManyPrestadores,
    updateAvailability,
    togglePrestadorStatus,
    deletePrestador
}; 