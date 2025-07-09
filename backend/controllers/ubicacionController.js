const Ubicacion = require('../models/ubicacion');
const axios = require('axios');

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
      const { nombre, tipo, calle, numero, referencia, predeterminada, coordenadas } = req.body;

      if (!coordenadas || !coordenadas.lat || !coordenadas.lng) {
        return res.status(400).json({ error: 'Coordenadas no proporcionadas o inválidas' });
      }

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
      console.error('Error al crear ubicación:', error);
      res.status(500).json({ error: 'Error al crear ubicación' });
    }
  },


  // Actualizar una ubicación existente
  actualizarUbicacion: async (req, res) => {
    try {
      const { nombre, tipo, calle, numero, referencia, coordenadas, predeterminada } = req.body;
      const ubicacionId = req.params.id;

      const ubicacionExistente = await Ubicacion.findOne({
        _id: ubicacionId,
        usuario: req.user.id
      });

      if (!ubicacionExistente) {
        return res.status(404).json({ mensaje: 'Ubicación no encontrada' });
      }

      if (!coordenadas || !coordenadas.lat || !coordenadas.lng) {
        return res.status(400).json({ error: 'Coordenadas no proporcionadas o inválidas' });
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