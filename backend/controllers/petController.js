// controllers/petController.js
const Pet = require('../models/Pet.js');

const createPet = async (req, res) => {
  try {
    const { name, type, breed, birthdate, weight, spayed, vaccines, allergies } = req.body;
    const newPet = new Pet({
      name,
      type,
      breed,
      birthdate,
      weight,
      spayed,
      vaccines,
      allergies,
      owner: req.user.id, // viene del middleware de autenticación
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tus mascotas' });
  }
};

module.exports = { createPet, getMyPets };