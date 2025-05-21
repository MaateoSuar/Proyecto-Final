const Prestador = require('../models/Prestador');

// Obtener todos los prestadores con opción de filtrado
const getAllPrestadores = async (req, res) => {
    try {
        const { tipoServicio } = req.query;
        let query = { isActive: true };

        // Si se proporciona un tipo de servicio, filtrar prestadores que tengan ese servicio
        if (tipoServicio) {
            // Usamos $elemMatch para buscar en el array de servicios
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

        res.status(200).json({
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

module.exports = {
    getAllPrestadores,
    createManyPrestadores
}; 