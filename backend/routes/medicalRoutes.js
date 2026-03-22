const express = require("express");
const {
  getDoctors,
  getDoctor,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAvailability,
} = require("../controllers/medicalController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Doctors
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctor);

// Appointments
router.post("/appointments", protect, bookAppointment);
router.get("/appointments", protect, getMyAppointments);

router.put("/appointments/:id/cancel", protect, cancelAppointment);
router.put("/appointments/:id/reschedule", protect, rescheduleAppointment);

router.get("/doctors/:id/availability", getDoctorAvailability);

module.exports = router;
