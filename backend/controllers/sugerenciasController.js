const axios = require('axios');

const obtenerSugerencias = async (req, res) => {
  const input = req.query.input;
  if (!input) {
    return res.status(400).json({ error: 'Falta parámetro input' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: process.env.GOOGLE_API_KEY,
        types: 'address',
        language: 'es',
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('Error en sugerencias de Google:', err.message);
    res.status(500).json({ error: 'Error al obtener sugerencias' });
  }
};

module.exports = { obtenerSugerencias };
