import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Stethoscope, ShieldCheck } from "lucide-react";
import { medicalAPI } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/medical";

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const [rescheduleAppt, setRescheduleAppt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_BASE_URL}/appointments`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch appointments");
            }

            const data = await res.json();
            setAppointments(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to cancel appointment");
            }

            setAppointments(prev =>
                prev.map(appt =>
                    appt._id === id
                        ? { ...appt, status: "cancelled" }
                        : appt
                )
            );

        } catch (err) {
            alert(err.message);
        }
    };
    const openReschedule = (appt) => {
        setRescheduleAppt(appt);
        setNewDate("");
        setNewTime("");
        setAvailableSlots([]);
    };

    const fetchAvailability = async (doctorId, date) => {
        try {
            setLoadingSlots(true);
            const res = await medicalAPI.getDoctorAvailability(doctorId, date);
            setAvailableSlots(res.data.availableSlots || []);
        } catch {
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };



    const RescheduleDrawer = () => {
        if (!rescheduleAppt) return null;

        return (
            <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
                <div className="w-full max-w-md h-full bg-white rounded-l-3xl p-6 shadow-xl overflow-y-auto">

                    <button
                        onClick={() => setRescheduleAppt(null)}
                        className="absolute top-4 right-4 text-2xl text-gray-400"
                    >
                        ×
                    </button>

                    <h2 className="text-xl font-bold mb-1">
                        Reschedule Appointment
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {rescheduleAppt.doctor.name} · {rescheduleAppt.doctor.specialization}
                    </p>

                    {/* DATE */}
                    <label className="font-semibold mb-2 block">Select Date</label>
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => {
                            setNewDate(e.target.value);
                            setNewTime("");
                            fetchAvailability(rescheduleAppt.doctor._id, e.target.value);
                        }}
                        className="w-full border rounded-xl px-4 py-3 mb-4"
                    />

                    {/* SLOTS */}
                    <label className="font-semibold mb-2 block">Available Time</label>

                    {loadingSlots && <p className="text-sm text-gray-500">Checking slots...</p>}

                    <div className="flex gap-2 flex-wrap mb-6">
                        {availableSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => setNewTime(time)}
                                className={`px-4 py-2 rounded-xl border ${newTime === time
                                    ? "bg-green-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!newDate || !newTime}
                        onClick={submitReschedule}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold disabled:bg-gray-300"
                    >
                        Confirm Reschedule
                    </button>
                </div>
            </div>
        );
    };

const submitReschedule = async () => {
    try {
        await medicalAPI.rescheduleAppointment(rescheduleAppt._id, {
            date: newDate,
            time: newTime,
        });

        setToast({
            type: "success",
            title: "Appointment Rescheduled",
            message: `${newDate} · ${newTime}`,
        });

        setRescheduleAppt(null);
        fetchAppointments();

        // auto dismiss toast
        setTimeout(() => setToast(null), 3500);

    } catch (err) {
        setToast({
            type: "error",
            title: "Reschedule Failed",
            message: "Slot already booked or invalid",
        });

        setTimeout(() => setToast(null), 3500);
    }
};


    const Toast = ({ toast }) => {
    if (!toast) return null;

    return (
        <div className="fixed top-6 right-6 z-[999] animate-slideIn">
            <div
                className={`rounded-2xl shadow-2xl px-6 py-4 w-80 border-l-4 ${
                    toast.type === "success"
                        ? "bg-green-50 border-green-600"
                        : "bg-red-50 border-red-600"
                }`}
            >
                <h4
                    className={`font-bold text-lg ${
                        toast.type === "success"
                            ? "text-green-700"
                            : "text-red-700"
                    }`}
                >
                    {toast.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                    {toast.message}
                </p>
            </div>
        </div>
    );
};


    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white py-16">
            <div className="max-w-5xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                        My Appointments
                    </h1>
                    <p className="text-gray-600">
                        View and manage all your medical bookings in one place
                    </p>
                </div>

                {/* LOADING */}
                {loading && (
                    <p className="text-center text-gray-500">
                        Loading your appointments...
                    </p>
                )}

                {/* ERROR */}
                {error && (
                    <p className="text-center text-red-500">
                        {error}
                    </p>
                )}

                {/* EMPTY */}
                {!loading && !error && appointments.length === 0 && (
                    <div className="text-center mt-20">
                        <ShieldCheck className="w-14 h-14 mx-auto text-green-600 mb-4" />
                        <p className="text-lg font-semibold text-gray-700">
                            No appointments yet
                        </p>
                        <p className="text-gray-500">
                            Book a doctor to see your appointments here
                        </p>
                        <button
                            onClick={() => window.location.href = "/medical"}
                            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                            Book a Doctor
                        </button>

                    </div>
                )}

                {/* APPOINTMENTS */}
                <div className="space-y-6">
                    {appointments.map((appt) => (
                        <div
                            key={appt._id}
                            className={`rounded-3xl p-6 transition shadow-lg ${appt.status === "cancelled"
                                ? "bg-gray-100 opacity-70"
                                : "bg-white hover:shadow-2xl"
                                }`}

                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                {/* LEFT */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {appt.doctor.name}
                                    </h3>
                                    <p className="text-green-600 font-medium">
                                        {appt.doctor.specialization}
                                    </p>

                                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {appt.doctor.hospital}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {appt.date}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {appt.time}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-col items-end gap-3">
                                    {/* Fee */}
                                    <p className="text-lg font-bold text-green-700">
                                        ₹{appt.doctor.fee}
                                    </p>

                                    {/* Status + Action */}
                                    <div className="flex items-center gap-3">
                                        {/* Status Badge */}
                                        {appt.status === "confirmed" ? (
                                            <span className="px-4 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold flex items-center gap-1">
                                                ✅ Confirmed
                                            </span>
                                        ) : (
                                            <span className="px-4 py-1 text-xs rounded-full bg-red-100 text-red-700 font-semibold flex items-center gap-1">
                                                ❌ Cancelled
                                            </span>
                                        )}

                                        {appt.status === "confirmed" && (
                                            <button
                                                onClick={() => openReschedule(appt)}
                                                className="px-4 py-1 text-xs rounded-full border border-blue-300 text-blue-600 font-semibold hover:bg-blue-50 transition"
                                            >
                                                Reschedule
                                            </button>
                                        )}


                                        {/* Cancel Button */}
                                        {appt.status === "confirmed" && (
                                            <button
                                                onClick={() => {
                                                    setAppointmentToCancel(appt._id);
                                                    setShowCancelModal(true);
                                                }}

                                                className="px-4 py-1 text-xs rounded-full border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">

                        <h3 className="text-xl font-bold mb-2">
                            Cancel Appointment?
                        </h3>

                        <p className="text-gray-600 mb-6">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setAppointmentToCancel(null);
                                }}
                                className="flex-1 py-2 rounded-xl border font-semibold hover:bg-gray-100"
                            >
                                No
                            </button>

                            <button
                                onClick={() => {
                                    cancelAppointment(appointmentToCancel);
                                    setShowCancelModal(false);
                                }}
                                className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        {rescheduleAppt && <RescheduleDrawer />}
        <Toast toast={toast} />

        </div>
    );
};

export default MyAppointments;
