import { useState, useEffect } from "react";
import { Search, Star, MapPin, Stethoscope, ShieldCheck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { medicalAPI } from "../services/api";


const API_BASE_URL = import.meta.env.VITE_API_URL + "/medical";


const Medical = () => {
    const [search, setSearch] = useState("");
    const [activeSpecialization, setActiveSpecialization] = useState("All");
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastAppointment, setLastAppointment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotLoading, setSlotLoading] = useState(false);

    const navigate = useNavigate();



    const specializations = [
        "All",
        ...Array.from(new Set(doctors.map(d => d.specialization))),
    ];

    useEffect(() => {
        fetchDoctors();
    }, [activeSpecialization]);

    const fetchAvailability = async (doctorId, date) => {
        try {
            setSlotLoading(true);
            setAvailableSlots([]);

            const res = await medicalAPI.getDoctorAvailability(doctorId, date);
            setAvailableSlots(res.data.availableSlots || []);
        } catch (err) {
            setAvailableSlots([]);
        } finally {
            setSlotLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);

            const query =
                activeSpecialization !== "All"
                    ? `?specialization=${encodeURIComponent(activeSpecialization)}`
                    : "";

            const res = await fetch(`${API_BASE_URL}/doctors${query}`);

            if (!res.ok) {
                throw new Error("Failed to fetch doctors");
            }

            const data = await res.json();
            setDoctors(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const filteredDoctors = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(search.toLowerCase())
    );

    const bookAppointment = async () => {
        try {
            setBookingLoading(true);

            const res = await fetch(`${API_BASE_URL}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor._id,
                    date: selectedDate,
                    time: selectedTime,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to book appointment");
            }

            const result = await res.json();

            setLastAppointment({
                doctor: selectedDoctor,
                date: selectedDate,
                time: selectedTime,
            });

            setSelectedDoctor(null);
            setShowSuccess(true);

            // auto hide after 4 seconds
            setTimeout(() => {
                setShowSuccess(false);
                setLastAppointment(null);
            }, 4000);

        } catch (err) {
            alert(err.message);
        } finally {
            setBookingLoading(false);
        }
    };


    const DoctorDrawer = () => {
        if (!selectedDoctor) return null;

        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
                <div className="w-full max-w-md h-full bg-white rounded-l-3xl shadow-2xl p-6 overflow-y-auto relative">

                    {/* Close */}
                    <button
                        onClick={() => setSelectedDoctor(null)}
                        className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-gray-700"
                    >
                        ×
                    </button>

                    {/* Doctor Info */}
                    <h2 className="text-2xl font-bold mb-1">
                        {selectedDoctor.name}
                    </h2>
                    <p className="text-green-600 font-medium mb-4">
                        {selectedDoctor.specialization}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <p>🏥 {selectedDoctor.hospital}</p>
                        <p>🩺 {selectedDoctor.experience}+ years experience</p>
                        <p>💰 Consultation Fee: ₹{selectedDoctor.fee}</p>
                    </div>

                    {/* Date */}
                    <label className="block font-semibold mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            const date = e.target.value;
                            setSelectedDate(date);
                            setSelectedTime(""); // reset time
                            fetchAvailability(selectedDoctor._id, date); // 🔥 CALL API HERE
                        }}
                        className="w-full border rounded-xl px-4 py-3 mb-4"
                    />


                    {/* Time Slots */}
                    <label className="block font-semibold mb-2">Available Time</label>

                    {slotLoading && (
                        <p className="text-sm text-gray-500 mb-4">
                            Checking availability...
                        </p>
                    )}

                    <div className="flex gap-2 flex-wrap mb-6">
                        {!slotLoading && availableSlots.length === 0 && selectedDate && (
                            <p className="text-sm text-red-500">
                                No slots available for this date
                            </p>
                        )}

                        {availableSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`px-4 py-2 rounded-xl border transition ${selectedTime === time
                                        ? "bg-green-600 text-white"
                                        : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>


                    {/* Confirm */}
                    <button
                        disabled={!selectedDate || !selectedTime || bookingLoading}
                        onClick={bookAppointment}
                        className={`w-full py-4 rounded-xl font-bold text-white transition ${selectedDate && selectedTime
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {bookingLoading ? "Booking..." : "Confirm Appointment"}
                    </button>
                </div>
            </div>
        );
    };

    const SuccessCard = () => {
        if (!showSuccess || !lastAppointment) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fadeIn">

                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <ShieldCheck className="w-9 h-9 text-green-600" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Appointment Confirmed
                    </h2>
                    <p className="text-green-600 font-medium mb-4">
                        Your booking is successful
                    </p>

                    {/* Details */}
                    <div className="bg-green-50 rounded-xl p-4 text-sm text-gray-700 space-y-2 mb-4">
                        <p><strong>Doctor:</strong> {lastAppointment.doctor.name}</p>
                        <p><strong>Specialization:</strong> {lastAppointment.doctor.specialization}</p>
                        <p><strong>Date:</strong> {lastAppointment.date}</p>
                        <p><strong>Time:</strong> {lastAppointment.time}</p>
                        <p><strong>Fee:</strong> ₹{lastAppointment.doctor.fee}</p>
                    </div>

                    <p className="text-xs text-gray-500">
                        You will be redirected shortly
                    </p>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
            {/* HERO */}
            <section className="relative py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="absolute top-6 right-6">
                    <button
                        onClick={() => navigate("/medical/appointments")}
                        className="bg-white text-green-700 px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-green-50 transition"
                    >
                        My Appointments
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Book Trusted Doctors Instantly
                    </h1>
                    <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto mb-10">
                        Consult verified doctors from top hospitals. Fast appointments,
                        transparent fees, and secure booking.
                    </p>

                    {/* SEARCH BAR */}
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-3 flex items-center">
                        <Search className="text-gray-400 mx-3" />
                        <input
                            type="text"
                            placeholder="Search doctor or specialization"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 outline-none text-gray-700 px-2 py-3"
                        />
                    </div>
                </div>
            </section>

            {/* SPECIALIZATION FILTER */}
            <section className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {specializations.map((spec) => (
                        <button
                            key={spec}
                            onClick={() => setActiveSpecialization(spec)}
                            className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition ${activeSpecialization === spec
                                ? "bg-green-600 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </section>

            {/* DOCTORS GRID */}
            <section className="max-w-7xl mx-auto px-4 pb-20">

                {/* LOADING */}
                {loading && (
                    <p className="text-center text-gray-500 mt-16">
                        Loading doctors...
                    </p>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-center text-red-500 mt-16">
                        {error}
                    </p>
                )}

                {/* DATA */}
                {!loading && !error && (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor._id}
                                    className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
                                >
                                    {/* 👇 YOUR EXISTING CARD UI — NO CHANGE */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                                            <p className="text-green-600 font-medium">
                                                {doctor.specialization}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-semibold">
                                                {doctor.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-5">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {doctor.hospital}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4 text-gray-400" />
                                            {doctor.experience}+ years experience
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            Consultation Fee: ₹{doctor.fee}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedDoctor(doctor);
                                            setSelectedDate("");
                                            setSelectedTime("");
                                            setAvailableSlots([]);
                                        }}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-95 transition"
                                    >
                                        Book Appointment
                                    </button>

                                </div>
                            ))}
                        </div>

                        {filteredDoctors.length === 0 && (
                            <p className="text-center text-gray-500 mt-16">
                                No doctors found for your search
                            </p>
                        )}
                    </>
                )}
            </section>


            {/* TRUST SECTION */}
            <section className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <ShieldCheck className="w-10 h-10 mx-auto text-green-600 mb-3" />
                        <h4 className="font-bold text-lg">Verified Doctors</h4>
                        <p className="text-gray-600">
                            Only certified and trusted professionals
                        </p>
                    </div>
                    <div>
                        <Clock className="w-10 h-10 mx-auto text-green-600 mb-3" />
                        <h4 className="font-bold text-lg">Quick Appointments</h4>
                        <p className="text-gray-600">
                            Book in under 30 seconds
                        </p>
                    </div>
                    <div>
                        <Star className="w-10 h-10 mx-auto text-green-600 mb-3" />
                        <h4 className="font-bold text-lg">Top Rated Care</h4>
                        <p className="text-gray-600">
                            Trusted by thousands of patients
                        </p>
                    </div>
                </div>
            </section>
            {selectedDoctor && <DoctorDrawer />}
            {showSuccess && <SuccessCard />}
        </div>
    );
};

export default Medical;
