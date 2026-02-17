const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

/*
GET /api/medical/doctors
Supports:
- search
- specialization
- minFee
- maxFee
- sort (rating | fee | experience)
- page
- limit
*/
exports.getDoctors = async (req, res, next) => {
  try {
    const {
      search,
      specialization,
      minFee,
      maxFee,
      sort,
      page = 1,
      limit = 500,
    } = req.query;

    const filter = {};

    // Filter by specialization
    if (specialization) {
      filter.specialization = specialization;
    }

    // Fee range filter
    if (minFee || maxFee) {
      filter.fee = {};
      if (minFee) filter.fee.$gte = Number(minFee);
      if (maxFee) filter.fee.$lte = Number(maxFee);
    }

    // Search by doctor name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let query = Doctor.find(filter);

    // Sorting
    if (sort) {
      const sortMap = {
        rating: { rating: -1 },
        fee: { fee: 1 },
        experience: { experience: -1 },
      };
      if (sortMap[sort]) {
        query = query.sort(sortMap[sort]);
      }
    } else {
      query = query.sort({ name: 1 });
    }

    // Pagination
    const skip = (page - 1) * limit;

    const doctors = await query.skip(skip).limit(Number(limit));
    const total = await Doctor.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/medical/doctors/:id
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/medical/appointments
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, date and time are required",
      });
    }

    // 🔍 Check if slot already booked
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: "confirmed",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctorId,
      date,
      time,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/medical/appointments
exports.getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).populate(
      "doctor",
      "name specialization fee hospital"
    );

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// CANCEL appointment
// DELETE /api/medical/appointments/:id
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // 🔐 Ownership check (AUTH HARDENING)
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this appointment",
      });
    }

    // 🚫 Prevent invalid cancels
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be cancelled",
      });
    }

    // ✅ Cancel appointment
    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// RESCHEDULE appointment
exports.rescheduleAppointment = async (req, res, next) => {
    try {
        const { date, time } = req.body;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: "New date and time required",
            });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        // ✅ FIX: exclude current appointment
        const conflict = await Appointment.findOne({
            doctor: appointment.doctor,
            date,
            time,
            status: "confirmed",
            _id: { $ne: appointment._id },
        });

        if (conflict) {
            return res.status(400).json({
                success: false,
                message: "Selected slot is already booked",
            });
        }

        appointment.date = date;
        appointment.time = time;
        appointment.status = "confirmed";

        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};


exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const doctorId = req.params.id;

    // ⏰ Default slots
    const allSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];

    // 🧾 Fetch booked slots
    const booked = await Appointment.find({
      doctor: doctorId,
      date,
      status: "confirmed",
    }).select("time");

    const bookedTimes = booked.map((a) => a.time);

    const availableSlots = allSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    res.status(200).json({
      success: true,
      date,
      availableSlots,
    });
  } catch (error) {
    next(error);
  }
};
