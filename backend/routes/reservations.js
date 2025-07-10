// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createReservation, getAllReservations, cancelReservation, leaveReview, getReservationsByProvider, updateReservationStatus, getReservationById } = require('../controllers/reservationController');

router.post('/', authMiddleware, createReservation);
router.get('/', authMiddleware, getAllReservations); // o sin auth si querés que sea público
router.delete('/:id', authMiddleware, cancelReservation);
router.post('/:id/review', authMiddleware, leaveReview);
router.get('/provider/:providerId', authMiddleware, getReservationsByProvider);
router.patch('/:id/status', authMiddleware, updateReservationStatus);
router.get('/:id', authMiddleware, getReservationById);


module.exports = router;