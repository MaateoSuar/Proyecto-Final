// routes/pets.js
const express = require('express');
const { createPet, getMyPets, getPetById, updatePet, deletePet } = require('../controllers/petController.js');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();
const upload = require('../middlewares/upload.js');

router.post('/', verifyToken, upload.single('image'), createPet);
router.get('/', verifyToken, getMyPets);
router.get('/:id', verifyToken, getPetById);
router.put('/:id', verifyToken, upload.single('image'), updatePet);
router.delete('/:id', verifyToken, deletePet);

module.exports = router;
