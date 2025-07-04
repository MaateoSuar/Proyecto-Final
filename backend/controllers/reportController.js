// controllers/reportController.js

const Report = require('../models/Report');

// Crear un nuevo reporte
exports.createReport = async (req, res) => {
  try {
    const { user, provider, reason } = req.body;

    if (!user || !provider || !reason) {
      return res.status(400).json({ message: 'Faltan campos requeridos.' });
    }

    const newReport = new Report({ user, provider, reason });
    await newReport.save();

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener todos los reportes
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'nombre email') // Ajusta los campos según tu esquema Usuario
      .populate('provider', 'nombre servicio'); // Ajusta según tu esquema Prestador

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Obtener un reporte por ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'nombre email')
      .populate('provider', 'nombre servicio');

    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado.' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Eliminar un reporte
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado.' });
    }

    res.status(200).json({ message: 'Reporte eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
