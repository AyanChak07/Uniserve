const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

// @desc    Get all events
// @route   GET /api/entertainment/events
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    const { category, date } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    } else {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort('date');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/entertainment/events/:id
// @access  Private
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book ticket
// @route   POST /api/entertainment/tickets
// @access  Private
exports.bookTicket = async (req, res, next) => {
  try {
    const { eventId, ticketType, quantity } = req.body;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const ticketTypeData = event.ticketTypes.find(t => t.type === ticketType);
    
    if (!ticketTypeData || ticketTypeData.available < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tickets available'
      });
    }

    const pricePerTicket = ticketTypeData.price;
    const total = pricePerTicket * quantity;
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const ticket = await Ticket.create({
      user: req.user.id,
      event: eventId,
      ticketType,
      quantity,
      pricePerTicket,
      total,
      bookingId
    });

    // Update available tickets
    ticketTypeData.available -= quantity;
    await event.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('event')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user tickets
// @route   GET /api/entertainment/tickets
// @access  Private
exports.getUserTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket payment
// @route   PUT /api/entertainment/tickets/:id/payment
// @access  Private
exports.updateTicketPayment = async (req, res, next) => {
  try {
    const { paymentId, paymentStatus } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    ticket.paymentId = paymentId;
    ticket.paymentStatus = paymentStatus;

    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};
