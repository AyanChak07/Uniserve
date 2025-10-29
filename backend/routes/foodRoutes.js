const express = require('express');
const {
  getRestaurants,
  getNearbyRestaurants,
  getRestaurant,
  createOrder,
  getUserOrders,
  updateOrderPayment
} = require('../controllers/foodController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/restaurants', getRestaurants);
router.get('/restaurants/nearby', getNearbyRestaurants);
router.get('/restaurants/:id', getRestaurant);
router.post('/orders', createOrder);
router.get('/orders', getUserOrders);
router.put('/orders/:id/payment', updateOrderPayment);

module.exports = router;
