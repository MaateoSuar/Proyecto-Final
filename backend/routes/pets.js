// routes/pets.js
const express = require('express');
const { createPet, getMyPets } = require('../controllers/petController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const multer = require('multer');

const router = express.Router();
const upload = require('../middlewares/upload.js');

router.post('/', verifyToken, upload.single('image'), createPet);
router.get('/', verifyToken, getMyPets);

module.exports = router;
