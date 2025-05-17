// routes/pets.js
const express = require('express');
const { createPet, getMyPets, getPetById, updatePet } = require('../controllers/petController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const multer = require('multer');

const router = express.Router();
const upload = require('../middlewares/upload.js');

router.post('/', verifyToken, upload.single('image'), createPet);
router.get('/', verifyToken, getMyPets);
router.get('/:id', verifyToken, getPetById);
router.put('/:id', verifyToken, upload.single('image'), updatePet);

module.exports = router;
