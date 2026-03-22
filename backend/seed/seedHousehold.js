const dotenv = require("dotenv");
const connectDB = require("../config/database");

const HouseholdCategory = require("../models/HouseholdCategory");
const HouseholdService = require("../models/HouseholdService");
const HouseholdProfessional = require("../models/HouseholdProfessional");

dotenv.config();
connectDB();

/* =========================
   CATEGORIES
========================= */
const categoriesData = [
  { name: "Cleaning", icon: "broom", isActive: true },
  { name: "Plumbing", icon: "pipe", isActive: true },
  { name: "Electrical", icon: "bolt", isActive: true },
  { name: "Appliance Repair", icon: "tools", isActive: true },
  { name: "Painting", icon: "paint-roller", isActive: true },
  { name: "Carpentry", icon: "hammer", isActive: true },
  { name: "Pest Control", icon: "bug", isActive: true },
  { name: "Home Maintenance", icon: "home", isActive: true },
];

/* =========================
   SEED FUNCTION
========================= */
const seedHousehold = async () => {
  try {
    await HouseholdCategory.deleteMany();
    await HouseholdService.deleteMany();
    await HouseholdProfessional.deleteMany();

    console.log("🗑️ Old household data cleared");

    /* INSERT CATEGORIES */
    const categories = await HouseholdCategory.insertMany(categoriesData);
    const cat = {};
    categories.forEach(c => (cat[c.name] = c._id));

    /* =========================
       SERVICES
    ========================= */
    const servicesData = [
      // CLEANING
      { name: "Full Home Deep Cleaning", category: cat["Cleaning"], basePrice: 2499, duration: 240 },
      { name: "Bathroom Deep Cleaning", category: cat["Cleaning"], basePrice: 899, duration: 90 },
      { name: "Kitchen Deep Cleaning", category: cat["Cleaning"], basePrice: 1099, duration: 120 },
      { name: "Sofa Shampooing", category: cat["Cleaning"], basePrice: 1299, duration: 120 },

      // PLUMBING
      { name: "Tap Leakage Repair", category: cat["Plumbing"], basePrice: 499, duration: 60 },
      { name: "Bathroom Fitting Installation", category: cat["Plumbing"], basePrice: 1599, duration: 120 },
      { name: "Pipeline Blockage Removal", category: cat["Plumbing"], basePrice: 799, duration: 90 },

      // ELECTRICAL
      { name: "Fan Installation", category: cat["Electrical"], basePrice: 399, duration: 45 },
      { name: "Switchboard Repair", category: cat["Electrical"], basePrice: 299, duration: 45 },
      { name: "Light & Chandelier Installation", category: cat["Electrical"], basePrice: 599, duration: 60 },

      // APPLIANCE
      { name: "AC Servicing", category: cat["Appliance Repair"], basePrice: 999, duration: 90 },
      { name: "AC Gas Refill", category: cat["Appliance Repair"], basePrice: 1999, duration: 120 },
      { name: "Washing Machine Repair", category: cat["Appliance Repair"], basePrice: 699, duration: 90 },
      { name: "Refrigerator Repair", category: cat["Appliance Repair"], basePrice: 799, duration: 90 },

      // PAINTING
      { name: "Interior Wall Painting", category: cat["Painting"], basePrice: 5999, duration: 480 },
      { name: "Wall Touch-up Painting", category: cat["Painting"], basePrice: 1999, duration: 180 },

      // CARPENTRY
      { name: "Furniture Assembly", category: cat["Carpentry"], basePrice: 899, duration: 90 },
      { name: "Door Repair", category: cat["Carpentry"], basePrice: 699, duration: 60 },

      // PEST
      { name: "Cockroach Control", category: cat["Pest Control"], basePrice: 1299, duration: 120 },
      { name: "Termite Treatment", category: cat["Pest Control"], basePrice: 3499, duration: 240 },

      // MAINTENANCE
      { name: "Annual Home Maintenance", category: cat["Home Maintenance"], basePrice: 4999, duration: 360 },
      { name: "Emergency Home Repair", category: cat["Home Maintenance"], basePrice: 999, duration: 90 },
    ].map(s => ({ ...s, isActive: true }));

    const services = await HouseholdService.insertMany(servicesData);
    const srv = {};
    services.forEach(s => (srv[s.name] = s._id));

    /* =========================
       PROFESSIONALS
    ========================= */
    const professionalsData = [
      {
        name: "Ramesh Kumar",
        phone: "9000011111",
        skills: [srv["Full Home Deep Cleaning"], srv["Bathroom Deep Cleaning"]],
        rating: 4.6,
        isAvailable: true,
        location: { type: "Point", coordinates: [77.2090, 28.6139] }, // Delhi
      },
      {
        name: "Amit Verma",
        phone: "9000022222",
        skills: [srv["Tap Leakage Repair"], srv["Pipeline Blockage Removal"]],
        rating: 4.5,
        isAvailable: true,
        location: { type: "Point", coordinates: [72.8777, 19.0760] }, // Mumbai
      },
      {
        name: "Suresh Yadav",
        phone: "9000033333",
        skills: [srv["Fan Installation"], srv["Switchboard Repair"]],
        rating: 4.7,
        isAvailable: true,
        location: { type: "Point", coordinates: [88.3639, 22.5726] }, // Kolkata
      },
      {
        name: "Rahul Singh",
        phone: "9000044444",
        skills: [srv["AC Servicing"], srv["AC Gas Refill"]],
        rating: 4.8,
        isAvailable: true,
        location: { type: "Point", coordinates: [77.5946, 12.9716] }, // Bangalore
      },
      {
        name: "Manoj Patel",
        phone: "9000055555",
        skills: [srv["Interior Wall Painting"], srv["Wall Touch-up Painting"]],
        rating: 4.6,
        isAvailable: true,
        location: { type: "Point", coordinates: [72.5714, 23.0225] }, // Ahmedabad
      },
      {
        name: "Deepak Sharma",
        phone: "9000066666",
        skills: [srv["Furniture Assembly"], srv["Door Repair"]],
        rating: 4.5,
        isAvailable: true,
        location: { type: "Point", coordinates: [78.4867, 17.3850] }, // Hyderabad
      },
      {
        name: "Vikas Mishra",
        phone: "9000077777",
        skills: [srv["Cockroach Control"], srv["Termite Treatment"]],
        rating: 4.7,
        isAvailable: true,
        location: { type: "Point", coordinates: [85.8245, 20.2961] }, // Bhubaneswar
      },
      {
        name: "Ankit Joshi",
        phone: "9000088888",
        skills: [srv["Annual Home Maintenance"], srv["Emergency Home Repair"]],
        rating: 4.4,
        isAvailable: true,
        location: { type: "Point", coordinates: [73.8567, 18.5204] }, // Pune
      },
    ];

    await HouseholdProfessional.insertMany(professionalsData);

    console.log("✅ Household ecosystem seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Household seeding failed", error);
    process.exit(1);
  }
};

seedHousehold();