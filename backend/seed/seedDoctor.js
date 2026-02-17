const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Doctor = require('../models/Doctor');

dotenv.config();
connectDB();

const doctors = [
  // ================= CARDIOLOGISTS =================
  { name: "Dr. Amit Sharma", specialization: "Cardiologist", experience: 15, fee: 800, hospital: "Apollo Hospitals, Mumbai", rating: 4.8, availability: ["09:00 AM", "11:00 AM"] },
  { name: "Dr. Rohan Mehta", specialization: "Cardiologist", experience: 12, fee: 750, hospital: "Apollo Hospitals, Mumbai", rating: 4.6, availability: ["10:00 AM", "01:00 PM"] },
  { name: "Dr. Sandeep Kulkarni", specialization: "Cardiologist", experience: 20, fee: 1000, hospital: "Fortis Hospital, Mumbai", rating: 4.9, availability: ["09:30 AM", "12:30 PM"] },
  { name: "Dr. Arvind Rao", specialization: "Cardiologist", experience: 18, fee: 900, hospital: "Kokilaben Hospital", rating: 4.7, availability: ["11:00 AM", "02:00 PM"] },

  // ================= DERMATOLOGISTS =================
  { name: "Dr. Neha Verma", specialization: "Dermatologist", experience: 10, fee: 500, hospital: "Fortis Hospital, Mumbai", rating: 4.6, availability: ["10:00 AM", "01:00 PM"] },
  { name: "Dr. Ritu Malhotra", specialization: "Dermatologist", experience: 14, fee: 650, hospital: "Apollo Hospitals, Delhi", rating: 4.7, availability: ["11:00 AM", "03:00 PM"] },
  { name: "Dr. Pankaj Sinha", specialization: "Dermatologist", experience: 8, fee: 450, hospital: "Max Hospital", rating: 4.4, availability: ["09:30 AM", "12:00 PM"] },
  { name: "Dr. Shweta Jain", specialization: "Dermatologist", experience: 11, fee: 550, hospital: "Medanta Hospital", rating: 4.5, availability: ["02:00 PM", "05:00 PM"] },

  // ================= ORTHOPEDICS =================
  { name: "Dr. Rajesh Kumar", specialization: "Orthopedic", experience: 18, fee: 700, hospital: "AIIMS Delhi", rating: 4.7, availability: ["09:30 AM", "12:00 PM"] },
  { name: "Dr. Mohit Aggarwal", specialization: "Orthopedic", experience: 22, fee: 950, hospital: "Fortis Hospital", rating: 4.9, availability: ["10:00 AM", "01:00 PM"] },
  { name: "Dr. Nitin Chawla", specialization: "Orthopedic", experience: 12, fee: 600, hospital: "Max Hospital", rating: 4.5, availability: ["11:00 AM", "02:00 PM"] },
  { name: "Dr. Prakash Iyer", specialization: "Orthopedic", experience: 16, fee: 750, hospital: "Apollo Hospitals", rating: 4.6, availability: ["03:00 PM", "06:00 PM"] },

  // ================= NEUROLOGISTS =================
  { name: "Dr. Anil Kapoor", specialization: "Neurologist", experience: 20, fee: 1000, hospital: "Medanta Hospital", rating: 4.9, availability: ["09:00 AM", "01:00 PM"] },
  { name: "Dr. Varun Malhotra", specialization: "Neurologist", experience: 17, fee: 900, hospital: "AIIMS Delhi", rating: 4.8, availability: ["10:30 AM", "02:30 PM"] },
  { name: "Dr. Kiran Desai", specialization: "Neurologist", experience: 14, fee: 850, hospital: "Fortis Hospital", rating: 4.6, availability: ["11:00 AM", "03:00 PM"] },

  // ================= PEDIATRICIANS =================
  { name: "Dr. Sneha Joshi", specialization: "Pediatrician", experience: 9, fee: 400, hospital: "Rainbow Children Hospital", rating: 4.6, availability: ["11:00 AM", "03:00 PM"] },
  { name: "Dr. Ankit Verma", specialization: "Pediatrician", experience: 6, fee: 350, hospital: "Cloudnine Hospital", rating: 4.4, availability: ["09:30 AM", "12:30 PM"] },
  { name: "Dr. Radhika Nair", specialization: "Pediatrician", experience: 12, fee: 500, hospital: "Apollo Hospitals", rating: 4.7, availability: ["02:00 PM", "05:00 PM"] },

  // ================= GENERAL PHYSICIANS =================
  { name: "Dr. Alok Singh", specialization: "General Physician", experience: 8, fee: 300, hospital: "Columbia Asia Hospital", rating: 4.3, availability: ["09:30 AM", "11:30 AM"] },
  { name: "Dr. Sunil Mishra", specialization: "General Physician", experience: 14, fee: 450, hospital: "Apollo Clinics", rating: 4.6, availability: ["10:00 AM", "01:00 PM"] },
  { name: "Dr. Kunal Shah", specialization: "General Physician", experience: 11, fee: 400, hospital: "Fortis Hospital", rating: 4.5, availability: ["02:00 PM", "05:00 PM"] },

  // ================= DENTISTS =================
  { name: "Dr. Ritu Bansal", specialization: "Dentist", experience: 7, fee: 350, hospital: "Clove Dental", rating: 4.5, availability: ["10:00 AM", "04:00 PM"] },
  { name: "Dr. Aman Gupta", specialization: "Dentist", experience: 10, fee: 450, hospital: "Apollo Dental", rating: 4.6, availability: ["09:00 AM", "01:00 PM"] },
  { name: "Dr. Neeraj Jain", specialization: "Dentist", experience: 15, fee: 600, hospital: "Fortis Dental", rating: 4.8, availability: ["02:00 PM", "06:00 PM"] },

  // ================= PSYCHIATRISTS =================
  { name: "Dr. Suresh Nair", specialization: "Psychiatrist", experience: 11, fee: 900, hospital: "NIMHANS", rating: 4.7, availability: ["02:00 PM", "05:00 PM"] },
  { name: "Dr. Aditi Rao", specialization: "Psychiatrist", experience: 9, fee: 700, hospital: "Fortis Hospital", rating: 4.5, availability: ["11:00 AM", "02:00 PM"] },

  // ================= ONCOLOGISTS =================
  { name: "Dr. Shalini Gupta", specialization: "Oncologist", experience: 21, fee: 1200, hospital: "Tata Memorial Hospital", rating: 4.9, availability: ["09:00 AM", "12:00 PM"] },
  { name: "Dr. Rajiv Menon", specialization: "Oncologist", experience: 18, fee: 1100, hospital: "AIIMS Delhi", rating: 4.8, availability: ["01:00 PM", "04:00 PM"] },
];

const seedDoctors = async () => {
  try {
    await Doctor.deleteMany();
    console.log("🗑️ Existing doctors removed");

    await Doctor.insertMany(doctors);
    console.log(`✅ ${doctors.length} Doctors seeded successfully`);

    process.exit();
  } catch (error) {
    console.error("❌ Doctor seeding failed", error);
    process.exit(1);
  }
};

seedDoctors();
