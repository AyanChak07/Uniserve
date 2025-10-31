const express = require('express');
const {
  getVehicles,
  getNearbyVehicles,
  createBooking,
  getUserBookings,
  updateBookingPayment
} = require('../controllers/transportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// ✅ PUT /nearby BEFORE /vehicles (more specific routes first)
router.get('/vehicles/nearby', getNearbyVehicles);
router.get('/vehicles', getVehicles);
router.post('/bookings', createBooking);
router.get('/bookings', getUserBookings);
router.put('/bookings/:id/payment', updateBookingPayment);

module.exports = router;