const mongoose = require("mongoose");

const HouseholdBookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HouseholdService",
            required: true,
        },
        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HouseholdProfessional",
        },

        scheduledDate: {
            type: Date,
            required: true,
        },

        // ✅ ADD THIS
        timeSlot: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        location: {
            lat: Number,
            lng: Number,
        },

        price: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "booked",
                "assigned",
                "in_progress",
                "completed",
                "cancelled",
            ],
            default: "booked",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HouseholdBooking", HouseholdBookingSchema);