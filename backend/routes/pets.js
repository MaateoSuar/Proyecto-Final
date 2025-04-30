// routes/pets.js
const express = require('express');
const { createPet, getMyPets } = require('../controllers/petController.js');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();

router.post('/', verifyToken, createPet);
router.get('/', verifyToken, getMyPets);

module.exports = router;
