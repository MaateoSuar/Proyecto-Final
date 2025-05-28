// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createReservation, getAllReservations, cancelReservation } = require('../controllers/reservationController');

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getAllReservations); // o sin auth si querés que sea público
router.delete('/:id', authMiddleware, cancelReservation);

module.exports = router;