import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    MapPin,
    ShieldCheck,
    RefreshCcw,
    X,
} from "lucide-react";
import HouseholdBookingDrawer from "./HouseholdBookingDrawer";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM",
];

const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const MyHouseholdBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rescheduleBooking, setRescheduleBooking] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newSlot, setNewSlot] = useState("");

    const [confirmCancel, setConfirmCancel] = useState(null);
    const [popup, setPopup] = useState(null);

    const [rebookItem, setRebookItem] = useState(null);


    useEffect(() => {
        fetchBookings();
    }, []);

    const showPopup = (msg) => {
        setPopup(msg);
        setTimeout(() => setPopup(null), 3000);
    };

    const fetchBookings = async () => {
        const res = await fetch(`${API_BASE}/bookings`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        setBookings(data.data || []);
        setLoading(false);
    };

    const cancelBooking = async () => {
        await fetch(`${API_BASE}/bookings/${confirmCancel._id}/cancel`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setConfirmCancel(null);
        showPopup("Booking Cancelled");
        fetchBookings();
    };

    const submitReschedule = async () => {
        await fetch(
            `${API_BASE}/bookings/${rescheduleBooking._id}/reschedule`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    scheduledDate: newDate,
                    timeSlot: newSlot,
                }),
            }
        );

        setRescheduleBooking(null);
        showPopup("Service Rescheduled");
        fetchBookings();
    };

    const rebookService = async (id) => {
        await fetch(`${API_BASE}/bookings/${id}/rebook`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        showPopup("Service Rebooked");
        fetchBookings();
    };

    if (loading)
        return <p className="text-center mt-20">Loading bookings...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white py-14 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10">
                    My Household Bookings
                </h1>

                <div className="space-y-8">
                    {bookings.map((b) => (
                        <div key={b._id} className="bg-white rounded-3xl p-6 shadow-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        {b.service?.name}
                                    </h3>

                                    <p className="text-purple-600 font-semibold mt-1">
                                        ₹{b.price}
                                    </p>

                                    <div className="mt-4 text-sm text-gray-600 space-y-2">
                                        <p>
                                            <Calendar className="inline w-4 h-4 mr-2" />
                                            {formatDate(b.scheduledDate)}
                                        </p>

                                        <p>
                                            <Clock className="inline w-4 h-4 mr-2" />
                                            {b.timeSlot || "Time slot will be assigned"}
                                        </p>

                                        <p>
                                            <MapPin className="inline w-4 h-4 mr-2" />
                                            {b.address}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`px-4 py-1 text-xs rounded-full font-semibold ${b.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {b.status.toUpperCase()}
                                </span>
                            </div>

                            {b.status === "booked" && (
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setConfirmCancel(b)}
                                        className="px-6 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={() => setRescheduleBooking(b)}
                                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
                                    >
                                        Reschedule
                                    </button>
                                </div>
                            )}

                            {b.status === "cancelled" && (
                                <button
                                    onClick={() => setRebookItem(b)}
                                    className="mt-6 flex items-center gap-2 text-purple-600 font-semibold"
                                >
                                    <RefreshCcw size={16} /> Rebook Service
                                </button>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            {/* CANCEL CONFIRM */}
            {confirmCancel && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
                        <h3 className="text-lg font-bold mb-4">
                            Cancel this booking?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmCancel(null)}
                                className="px-6 py-2 rounded-xl border"
                            >
                                No
                            </button>
                            <button
                                onClick={cancelBooking}
                                className="px-6 py-2 rounded-xl bg-red-500 text-white"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESCHEDULE DRAWER */}
            {rescheduleBooking && (
                <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
                    <div className="w-full max-w-md h-full bg-white rounded-l-3xl p-6">
                        <button
                            onClick={() => setRescheduleBooking(null)}
                            className="absolute top-4 right-4 text-gray-400"
                        >
                            <X size={28} />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            Reschedule Service
                        </h2>

                        <input
                            type="date"
                            className="w-full border rounded-xl px-4 py-3 mb-4"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2 mb-6">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot}
                                    onClick={() => setNewSlot(slot)}
                                    className={`px-4 py-2 rounded-xl border ${newSlot === slot
                                        ? "bg-purple-600 text-white"
                                        : ""
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={!newDate || !newSlot}
                            onClick={submitReschedule}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-bold"
                        >
                            Confirm Reschedule
                        </button>
                    </div>
                </div>
            )}

            {/* SUCCESS POPUP */}
            {popup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white px-8 py-4 rounded-2xl shadow-xl text-lg font-semibold">
                        {popup}
                    </div>
                </div>
            )}

            {rebookItem && (
                <HouseholdBookingDrawer
                    existingBooking={rebookItem}
                    service={rebookItem.service}
                    userLocation={rebookItem.location}
                    onClose={() => setRebookItem(null)}
                    onSuccess={fetchBookings}
                />
            )}

        </div>
    );
};

export default MyHouseholdBookings;