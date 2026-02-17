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
    
    // ✅ FIXED: Only filter by specific date if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    // REMOVED strict future date filter - shows ALL events now!

    const events = await Event.find(query).sort({ date: 1 });

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
    const { eventInfo, ticketType, quantity } = req.body;

    if (!eventInfo || !ticketType || !quantity) {
      return res.status(400).json({
        success: false,
        message: "eventInfo, ticketType and quantity are required"
      });
    }

    // 1️⃣ Find actual event from DB
    const event = await Event.findOne({ title: eventInfo.title });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // 2️⃣ Find ticket type in DB
    const ticketTypeData = event.ticketTypes.find(
      t => t.type.toLowerCase() === ticketType.toLowerCase()
    );


    if (!ticketTypeData) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket type"
      });
    }

    // 3️⃣ Check availability
    if (ticketTypeData.available < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough tickets available"
      });
    }

    // 4️⃣ Reduce availability in DB
    ticketTypeData.available -= quantity;
    await event.save();

    // 5️⃣ Calculate pricing
    const pricePerTicket = ticketTypeData.price;
    const total = pricePerTicket * quantity;

    const bookingId = `BK${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // 6️⃣ Create ticket
    const ticket = await Ticket.create({
      user: req.user.id,
      eventInfo,
      ticketType,
      quantity,
      pricePerTicket,
      total,
      bookingId
    });

    const populatedTicket = await Ticket.findById(ticket._id)
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
      .populate('user', 'name email phone')
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
