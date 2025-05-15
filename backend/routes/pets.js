// routes/pets.js
const express = require('express');
const { createPet, getMyPets } = require('../controllers/petController.js');
const verifyToken = require('../middlewares/verifyToken.js');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Asegurate que esta carpeta exista
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});

const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), createPet);
router.get('/', verifyToken, getMyPets);

module.exports = router;
