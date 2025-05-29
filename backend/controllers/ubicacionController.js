const Ubicacion = require('../models/ubicacion');
const axios = require('axios');

// Función auxiliar para obtener coordenadas desde una dirección usando Nominatim (OpenStreetMap)
async function obtenerCoordenadas(direccion) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: direccion,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'TuApp/1.0'
      }
    });

    if (response.data && response.data[0]) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
    throw new Error('No se encontraron coordenadas para la dirección proporcionada');
  } catch (error) {
    throw error;
  }
}

// Exportar todas las funciones del controlador
module.exports = {
  // Obtener todas las ubicaciones del usuario
  obtenerUbicaciones: async (req, res) => {
    try {
      const todasLasUbicaciones = await Ubicacion.find();
      const ubicaciones = todasLasUbicaciones.filter(
        ubicacion => ubicacion.usuario.toString() === req.user.id
      );
      res.json(ubicaciones);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ubicaciones' });
    }
  },

  // Crear una nueva ubicación
  crearUbicacion: async (req, res) => {
    try {
      const { nombre, tipo, calle, numero, referencia, predeterminada } = req.body;
      
      const direccionCompleta = `${calle} ${numero}`;
      const coordenadas = await obtenerCoordenadas(direccionCompleta);
      
      if (predeterminada) {
        await Ubicacion.updateMany(
          { usuario: req.user.id },
          { predeterminada: false }
        );
      }

      const ubicacion = new Ubicacion({
        usuario: req.user.id,
        nombre,
        tipo,
        calle,
        numero,
        referencia,
        predeterminada,
        coordenadas
      });

      await ubicacion.save();
      res.status(201).json(ubicacion);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear ubicación' });
    }
  },

  // Actualizar una ubicación existente
  actualizarUbicacion: async (req, res) => {
    try {
      const { nombre, tipo, calle, numero, referencia, predeterminada } = req.body;
      const ubicacionId = req.params.id;

      const ubicacionExistente = await Ubicacion.findOne({
        _id: ubicacionId,
        usuario: req.user.id
      });

      if (!ubicacionExistente) {
        return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
      }

      let coordenadas = ubicacionExistente.coordenadas;
      if (calle !== ubicacionExistente.calle || numero !== ubicacionExistente.numero) {
        coordenadas = await obtenerCoordenadas(calle + ' ' + numero);
      }

      const ubicacionActualizada = await Ubicacion.findByIdAndUpdate(
        ubicacionId,
        {
          nombre,
          tipo,
          calle,
          numero,
          referencia,
          coordenadas,
          predeterminada
        },
        { new: true }
      );

      res.json(ubicacionActualizada);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la ubicación' });
    }
  },

  // Eliminar una ubicación
  eliminarUbicacion: async (req, res) => {
    try {
      const ubicacion = await Ubicacion.findOneAndDelete({
        _id: req.params.id,
        usuario: req.user.id
      });

      if (!ubicacion) {
        return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
      }

      res.json({ mensaje: 'Ubicación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar la ubicación' });
    }
  },

  // Establecer una ubicación como predeterminada
  establecerPredeterminada: async (req, res) => {
    try {
      const ubicacion = await Ubicacion.findOne({
        _id: req.params.id,
        usuario: req.user.id
      });

      if (!ubicacion) {
        return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
      }

      ubicacion.predeterminada = true;
      await ubicacion.save();

      res.json(ubicacion);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al establecer la ubicación predeterminada' });
    }
  }
}; 