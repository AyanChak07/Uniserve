import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ShieldCheck,
    Star,
    Clock,
    MapPin,
    Loader2,
} from "lucide-react";

import MapComponent from "../components/maps/MapComponent";
import HouseholdBookingDrawer from "./HouseholdBookingDrawer";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const HouseholdDetails = () => {
    const { id } = useParams();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [location, setLocation] = useState(null);
    const [showBooking, setShowBooking] = useState(false);

    /* ===============================
       USER LOCATION
    =============================== */
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            () => {
                setLocation({ lat: 28.6139, lng: 77.209 });
            }
        );
    }, []);

    /* ===============================
       FETCH SERVICE DETAILS
    =============================== */
    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetch(`${API_BASE}/services`);
                const data = await res.json();

                const found = data.data.find((s) => s._id === id);
                if (!found) throw new Error("Service not found");

                setService(found);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    /* ===============================
       UI STATES
    =============================== */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <p className="text-xl font-semibold mb-2">
                    Unable to load service
                </p>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-12">

            {/* ===============================
                HERO SECTION
            =============================== */}
            <div className="max-w-7xl mx-auto px-4 mb-10 grid lg:grid-cols-2 gap-10">

                {/* LEFT */}
                <div>
                    <h1 className="text-4xl font-extrabold mb-3">
                        {service.name}
                    </h1>

                    <p className="text-gray-600 mb-4">
                        {service.category?.name}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {service.rating || 4.6}
                        </span>

                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {service.duration || "60 mins"}
                        </span>
                    </div>

                    <div className="text-3xl font-bold text-green-700 mb-6">
                        ₹{service.basePrice}
                    </div>

                    <button
                        onClick={() => setShowBooking(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600
                                   text-white px-8 py-4 rounded-2xl
                                   font-bold text-lg hover:opacity-95 transition"
                    >
                        Book This Service
                    </button>
                </div>

                {/* RIGHT – MAP */}
                {location && (
                    <MapComponent
                        center={[location.lat, location.lng]}
                        height="340px"
                        markers={[
                            {
                                position: [location.lat, location.lng],
                                popup: "Your Location",
                                emoji: "🏠",
                            },
                        ]}
                    />
                )}
            </div>

            {/* ===============================
                DETAILS SECTION
            =============================== */}
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10">

                {/* WHAT’S INCLUDED */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">
                        What’s Included
                    </h3>

                    <ul className="space-y-3 text-sm text-gray-600">
                        {(service.includes || [
                            "Inspection & diagnosis",
                            "Professional tools & equipment",
                            "Standard service warranty",
                            "Clean-up after work",
                        ]).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* PRICING BREAKDOWN */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">
                        Pricing Details
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Service Charge</span>
                            <span>₹{service.basePrice}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Taxes & Fees</span>
                            <span>Included</span>
                        </div>

                        <hr />

                        <div className="flex justify-between font-bold text-lg text-green-700">
                            <span>Total</span>
                            <span>₹{service.basePrice}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===============================
                BOOKING DRAWER
            =============================== */}
            {showBooking && location && (
                <HouseholdBookingDrawer
                    service={service}
                    userLocation={location}
                    onClose={() => setShowBooking(false)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default HouseholdDetails;