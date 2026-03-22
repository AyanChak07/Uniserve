# 🏠 Uniserve – One Platform, Multiple Services

Uniserve is a **full-stack service aggregation platform** that allows users to access and manage multiple daily-life services such as **Transport, Food Ordering, Entertainment Ticket Booking, Medical Appointments, and Household Services** — all from a single unified dashboard.

The goal of Uniserve is to simplify everyday tasks by providing a smooth, modern, and scalable service experience.

---

## 🚀 Features

### 🔐 Authentication
- Secure user authentication
- Login & Register functionality
- User profile management

### 🚕 Transport
- Book rides
- View ride history
- Fare calculation & booking details

### 🍔 Food Ordering
- Browse restaurants
- Place food orders
- Track order history

### 🎟 Entertainment
- Browse movies, concerts, sports & events
- Seat categories & ticket booking
- View booked tickets

### 🏥 Medical Services
- Browse doctors by specialization
- Book doctor appointments
- View medical appointment history

### 🧹 Household Services
- Browse services (Cleaning, Electrical, Plumbing, Appliance Repair, etc.)
- Location-based service discovery
- Book household professionals
- View past bookings
- Integrated map view

### 📊 Dashboard
- Quick actions for all services
- Recent activity overview
- User statistics (rides, orders, tickets, medical, household)
- Clean, modern UI with responsive design

---

## 🧩 Project Status

🟢 **Actively developed** Core features are implemented and functional. The project is suitable for demos, academic submissions, and portfolio use.

---

## 🛠 Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **React Router**
- **Lucide Icons**
- Modern component-based architecture

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- RESTful APIs

### Other Tools
- JWT Authentication
- Environment variables using `.env`
- Seed scripts for demo data
- Map integration for location-based services

---

## 📂 Project Structure (High Level)

```text
Uniserve/
│
├── client/               # Frontend (React + Tailwind)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── context/
│
├── server/               # Backend (Node + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── seeders/
│   └── config/
│
├── README.md
└── package.json

```

---

## ▶️ Running the Project Locally

### 1. Run the Backend

```bash
cd server
npm install
npm run dev

```

### 2. Run the Frontend

```bash
cd client
npm install
npm run dev

```

---

## 🧪 Seed Data

The project includes seed scripts for Doctors, Events, and Household services. Run seeders using:

```bash
cd server
node seedDoctors.js (Example)

```

*(Ensure MongoDB is connected before running seeds)*

---

## 🎯 Vision

Uniserve is designed to be:

* **Scalable** – easy to add new services.
* **User-friendly** – modern, clean UI.
* **Real-world ready** – realistic data models & flows.

**Future Improvements:**

* Admin dashboard
* Payment gateway integration
* Real-time tracking
* Reviews & ratings system

---

## ⭐ Support

If you like this project, give it a **star** ⭐ and feel free to fork or contribute!