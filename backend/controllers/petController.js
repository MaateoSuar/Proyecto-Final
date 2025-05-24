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

const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findOne({ _id: id, owner: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    res.json(pet);
  } catch (err) {
    console.error('Error al obtener mascota:', err);
    res.status(500).json({ message: 'Error al obtener la mascota' });
  }
};

const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, birthdate, weight, spayed, vaccines, allergies } = req.body;
    
    // Verificar que la mascota existe y pertenece al usuario
    const pet = await Pet.findOne({ _id: id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    // Preparar los datos actualizados
    const updateData = {
      name,
      breed,
      birthdate,
      weight,
      spayed,
      vaccines: JSON.parse(vaccines),
      allergies: JSON.parse(allergies),
    };

    // Si hay una nueva imagen, subirla a Cloudinary
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
      updateData.image = result.secure_url;
    }

    // Actualizar la mascota
    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedPet);
  } catch (err) {
    console.error('Error al actualizar mascota:', err);
    res.status(500).json({ message: err.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que la mascota existe y pertenece al usuario
    const pet = await Pet.findOne({ _id: id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ message: 'Mascota no encontrada' });
    }

    // Eliminar la mascota
    await Pet.findByIdAndDelete(id);

    res.json({ message: 'Mascota eliminada con éxito' });
  } catch (err) {
    console.error('Error al eliminar mascota:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPet, getMyPets, getPetById, updatePet, deletePet };