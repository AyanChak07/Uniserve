const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

// @desc    Get nearby restaurants
// @route   GET /api/food/restaurants/nearby
// @access  Private
exports.getNearbyRestaurants = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    const restaurants = await Restaurant.find({
      isOpen: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants
// @route   GET /api/food/restaurants
// @access  Private
exports.getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isOpen: true });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/food/restaurants/:id
// @access  Private
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/food/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, specialInstructions } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = restaurant.deliveryFee;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      specialInstructions
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/food/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment
// @route   PUT /api/food/orders/:id/payment
// @access  Private
exports.updateOrderPayment = async (req, res, next) => {
  try {
    const { paymentId, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    order.paymentId = paymentId;
    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === 'completed') {
      order.status = 'confirmed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
