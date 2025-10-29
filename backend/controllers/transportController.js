const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get nearby vehicles
// @route   GET /api/transport/vehicles/nearby
// @access  Private
exports.getNearbyVehicles = async (req, res, next) => {
  try {
    const { longitude, latitude, type, maxDistance = 5000 } = req.query;

    const query = {
      available: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    if (type) {
      query.type = type;
    }

    const vehicles = await Vehicle.find(query);

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles
// @route   GET /api/transport/vehicles
// @access  Private
exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ available: true });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking
// @route   POST /api/transport/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { vehicleId, pickup, dropoff, distance, fare, scheduledTime } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle || !vehicle.available) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle not available'
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      pickup,
      dropoff,
      distance,
      fare,
      scheduledTime: scheduledTime || Date.now()
    });

    // Update vehicle availability
    vehicle.available = false;
    await vehicle.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/transport/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('vehicle')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking payment
// @route   PUT /api/transport/bookings/:id/payment
// @access  Private
exports.updateBookingPayment = async (req, res, next) => {
  try {
    const { paymentId, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.paymentId = paymentId;
    booking.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'completed') {
      booking.status = 'confirmed';
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
