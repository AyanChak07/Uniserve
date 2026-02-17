const HouseholdCategory = require("../models/HouseholdCategory");
const HouseholdService = require("../models/HouseholdService");
const HouseholdProfessional = require("../models/HouseholdProfessional");
const HouseholdBooking = require("../models/HouseholdBooking");

/* ======================================================
    UTILITIES
====================================================== */

const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
};

const calculatePrice = ({ basePrice, date, timeSlot, urgent }) => {
    let price = basePrice;

    // Weekend surcharge
    if (isWeekend(date)) {
        price += Math.round(basePrice * 0.15);
    }

    // Peak hours
    if (timeSlot === "09:00-11:00" || timeSlot === "18:00-20:00") {
        price += Math.round(basePrice * 0.1);
    }

    // Urgent booking
    if (urgent) {
        price += 200;
    }

    return price;
};

/* ======================================================
   CATEGORY
====================================================== */

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await HouseholdCategory.find({ isActive: true }).sort(
            "name",
        );

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   SERVICES
====================================================== */

exports.getServices = async (req, res, next) => {
    try {
        const { category } = req.query;

        const filter = { isActive: true };
        if (category) filter.category = category;

        const services = await HouseholdService.find(filter)
            .populate("category", "name icon")
            .sort("name");

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

exports.getNearbyServices = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        // Pre-seeded demo logic
        const services = await HouseholdService.find({ isActive: true }).populate(
            "category",
            "name icon",
        );

        res.status(200).json({
            success: true,
            userLocation: { lat, lng },
            count: services.length,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   BOOKINGS
====================================================== */

exports.createBooking = async (req, res, next) => {
    try {
        const {
            serviceId,
            scheduledDate,
            timeSlot,
            address,
            location,
            urgent = false,
        } = req.body;

        if (!serviceId || !scheduledDate || !timeSlot || !address) {
            return res.status(400).json({
                success: false,
                message: "Service, date, time slot and address are required",
            });
        }

        const service = await HouseholdService.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        // Prevent duplicate slot booking
        const existing = await HouseholdBooking.findOne({
            service: serviceId,
            scheduledDate,
            timeSlot,
            status: "booked",
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked",
            });
        }

        // Assign professional if available
        const professional = await HouseholdProfessional.findOne({
            skills: service._id,
            isAvailable: true,
        });

        const finalPrice = calculatePrice({
            basePrice: service.basePrice,
            date: scheduledDate,
            timeSlot,
            urgent,
        });

        const booking = await HouseholdBooking.create({
            user: req.user.id,
            service: service._id,
            professional: professional ? professional._id : null,
            scheduledDate,
            timeSlot,
            address,
            location,
            price: finalPrice,
            status: "booked",
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await HouseholdBooking.find({ user: req.user.id })
            .populate("service", "name basePrice duration")
            .populate("professional", "name")
            .sort("-createdAt");

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

/* ======================================================
   BOOKING ACTIONS
====================================================== */

exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await HouseholdBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
        });
    } catch (error) {
        next(error);
    }
};

exports.rescheduleBooking = async (req, res, next) => {
    try {
        const { scheduledDate, timeSlot } = req.body;

        if (!scheduledDate || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Date and time slot are required",
            });
        }

        const booking = await HouseholdBooking.findById(req.params.id)
            .populate("service");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        const conflict = await HouseholdBooking.findOne({
            service: booking.service._id,
            scheduledDate,
            timeSlot,
            status: "booked",
            _id: { $ne: booking._id },
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Selected slot already booked",
            });
        }

        booking.scheduledDate = scheduledDate;
        booking.timeSlot = timeSlot;

        // ✅ Recalculate price
        booking.price = calculatePrice({
            basePrice: booking.service.basePrice,
            date: scheduledDate,
            timeSlot,
            urgent: false,
        });

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};


exports.rebookService = async (req, res, next) => {
    try {
        const oldBooking = await HouseholdBooking.findById(req.params.id);

        if (!oldBooking) {
            return res.status(404).json({
                success: false,
                message: "Original booking not found",
            });
        }

        const newBooking = await HouseholdBooking.create({
            user: req.user.id,
            service: oldBooking.service,
            professional: oldBooking.professional,
            scheduledDate: req.body.scheduledDate,
            timeSlot: req.body.timeSlot,
            address: oldBooking.address,
            location: oldBooking.location,
            price: oldBooking.price,
            status: "booked",
        });

        res.status(201).json({
            success: true,
            data: newBooking,
        });
    } catch (error) {
        next(error);
    }
};
