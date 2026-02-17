const mongoose = require("mongoose");

const HouseholdProfessionalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HouseholdService",
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
    },
    totalJobs: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "HouseholdProfessional",
  HouseholdProfessionalSchema
);
