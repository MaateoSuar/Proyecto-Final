// controllers/petController.js
const Pet = require('../models/Pet.js');
const { cloudinary } = require('../config/cloudinary.js');

const createPet = async (req, res) => {
  try {
    const { name, type, breed, birthdate, weight, spayed, vaccines, allergies } = req.body;
    let imageUrl = null;

    if (req.file && req.file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'pets' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPet = new Pet({
      name,
      type,
      breed,
      birthdate,
      weight,
      spayed,
      vaccines: JSON.parse(vaccines),
      allergies: JSON.parse(allergies),
      image: imageUrl,
      owner: req.user.id,
    });

    await newPet.save();
    res.status(201).json(newPet);

  } catch (err) {
    console.error('Error en createPet:', err);
    res.status(500).json({ message: err.message });
  }
};

const getMyPets = async (req, res) => {
  try {
    const userId = req.user.id; // <- esto lo pone verifyToken
    const pets = await Pet.find({ owner: userId });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tus mascotas' });
  }
};

module.exports = { createPet, getMyPets };