const express = require('express');
const {
  getEvents,
  getEvent,
  bookTicket,
  getUserTickets,
  updateTicketPayment
} = require('../controllers/entertainmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/tickets', bookTicket);
router.get('/tickets', getUserTickets);
router.put('/tickets/:id/payment', updateTicketPayment);

module.exports = router;
