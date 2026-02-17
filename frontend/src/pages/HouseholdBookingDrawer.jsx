import { useState } from "react";
import { ShieldCheck, Calendar, MapPin, Clock, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM",
];

const HouseholdBookingDrawer = ({
    service,
    existingBooking,
    onClose,
    userLocation,
    onSuccess,
}) => {
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [address, setAddress] = useState(existingBooking?.address || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isRebook = Boolean(existingBooking);

    /* ===============================
       PRICE PREVIEW
    =============================== */
    const calculatePreviewPrice = () => {
        let price = service.basePrice;

        const day = new Date(date).getDay();
        if (day === 0 || day === 6) price += Math.round(price * 0.15);
        if (timeSlot === "09:00 AM - 11:00 AM" || timeSlot === "05:00 PM - 07:00 PM")
            price += Math.round(price * 0.1);

        return price;
    };

    /* ===============================
       SUBMIT
    =============================== */
    const submitBooking = async () => {
        if (!date || !timeSlot || !address) return;

        setLoading(true);

        const url = isRebook
            ? `${API_BASE}/bookings/${existingBooking._id}/rebook`
            : `${API_BASE}/bookings`;

        const body = isRebook
            ? { scheduledDate: date, timeSlot }
            : {
                serviceId: service._id,
                scheduledDate: date,
                timeSlot,
                address,
                location: userLocation,
            };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error();

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onSuccess();
                onClose();
            }, 2500);
        } catch {
            alert("Booking failed");
        } finally {
            setLoading(false);
        }
    };

    /* ===============================
       SUCCESS
    =============================== */
    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-3xl p-8 text-center shadow-xl">
                    <ShieldCheck className="mx-auto w-12 h-12 text-green-600 mb-4" />
                    <h2 className="text-xl font-bold">
                        {isRebook ? "Service Rebooked" : "Booking Confirmed"}
                    </h2>
                </div>
            </div>
        );
    }

    /* ===============================
       DRAWER
    =============================== */
    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
            <div className="w-full max-w-md h-full bg-white rounded-l-3xl flex flex-col">

                {/* HEADER */}
                <div className="p-6 border-b relative">
                    <button onClick={onClose} className="absolute top-4 right-4">
                        <X size={26} />
                    </button>

                    <h2 className="text-2xl font-bold">
                        {isRebook ? "Rebook Service" : service.name}
                    </h2>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

                    {/* DATE */}
                    <label className="font-semibold block">
                        <Calendar className="inline mr-2" /> Date
                    </label>
                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    {/* TIME SLOT */}
                    <label className="font-semibold block">
                        <Clock className="inline mr-2" /> Time Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setTimeSlot(slot)}
                                className={`px-4 py-2 rounded-xl border text-sm ${
                                    timeSlot === slot
                                        ? "bg-purple-600 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>

                    {/* ADDRESS */}
                    {!isRebook && (
                        <>
                            <label className="font-semibold block">
                                <MapPin className="inline mr-2" /> Address
                            </label>
                            <textarea
                                rows="2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border rounded-xl px-4 py-2 resize-none"
                            />
                        </>
                    )}

                    {/* PRICE */}
                    {date && timeSlot && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border">
                            <p className="text-sm text-gray-600">Estimated Price</p>
                            <p className="text-2xl font-extrabold text-purple-600">
                                ₹{calculatePreviewPrice()}
                            </p>
                            <p className="text-xs text-gray-500">
                                Includes weekend / peak-hour adjustments
                            </p>
                        </div>
                    )}
                </div>

                {/* STICKY BUTTON */}
                <div className="p-6 border-t bg-white sticky bottom-0">
                    <button
                        disabled={!date || !timeSlot}
                        onClick={submitBooking}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-bold"
                    >
                        {loading
                            ? "Processing..."
                            : isRebook
                            ? "Confirm Rebook"
                            : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HouseholdBookingDrawer;