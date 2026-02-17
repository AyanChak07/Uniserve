const express = require("express");
const router = express.Router();

const {
    getCategories,
    getServices,
    getNearbyServices,
    createBooking,
    getMyBookings,
    cancelBooking,
    rescheduleBooking,
    rebookService,
} = require("../controllers/householdController");

const { protect } = require("../middleware/auth");

/* ======================================================
    PUBLIC ROUTES
====================================================== */

// Categories (Electrician, Plumber, Cleaning, etc.)
router.get("/categories", getCategories);

// Services (optionally by category)
router.get("/services", getServices);

// Map-based nearby services (Leaflet integration)
router.post("/services/nearby", getNearbyServices);

/* ======================================================
    PRIVATE ROUTES (AUTH REQUIRED)
====================================================== */

// Create booking
router.post("/bookings", protect, createBooking);

// Get logged-in user's bookings
router.get("/bookings", protect, getMyBookings);

// Cancel booking
router.put("/bookings/:id/cancel", protect, cancelBooking);

// Reschedule booking
router.put("/bookings/:id/reschedule", protect, rescheduleBooking);

// Rebook previous service
router.post("/bookings/:id/rebook", protect, rebookService);

module.exports = router;