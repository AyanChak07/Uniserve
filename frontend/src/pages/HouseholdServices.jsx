import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Star,
    Clock,
    ArrowLeft,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import HouseholdBookingDrawer from "./HouseholdBookingDrawer";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const HouseholdServices = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category");

    const [services, setServices] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    /* ===============================
       FETCH SERVICES
    =============================== */
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const url = categoryId
                    ? `${API_BASE}/services?category=${categoryId}`
                    : `${API_BASE}/services`;

                const res = await fetch(url);
                const data = await res.json();

                if (!res.ok) throw new Error("Failed to fetch services");

                setServices(data.data || []);
                setCategory(data.data?.[0]?.category || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [categoryId]);

    /* ===============================
       UI STATES
    =============================== */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-14 h-14 text-red-500 mb-4" />
                <p className="text-lg font-semibold text-gray-800">
                    Unable to load services
                </p>
                <p className="text-gray-500 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-16 px-4">

            {/* ===============================
                HEADER
            =============================== */}
            <div className="max-w-7xl mx-auto mb-10">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline mb-6"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                    {category?.name || "Household Services"}
                </h1>

                <p className="text-gray-600 text-lg max-w-2xl">
                    Skilled professionals for reliable home services
                </p>
            </div>

            {/* ===============================
                SERVICES GRID
            =============================== */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white rounded-3xl shadow-lg p-6 
                                   hover:shadow-2xl transition-all 
                                   transform hover:-translate-y-1"
                    >
                        {/* TITLE */}
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {service.name}
                        </h3>

                        {/* CATEGORY */}
                        <p className="text-sm text-gray-600 mb-3">
                            {service.category?.name}
                        </p>

                        {/* META */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {service.rating || 4.7}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {service.duration || "60 mins"}
                            </span>
                        </div>

                        {/* PRICE */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-lg font-bold text-green-700">
                                ₹{service.basePrice}
                            </div>

                            <button
                                onClick={() => setSelectedService(service)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 
                                           text-white px-6 py-2 rounded-xl 
                                           font-semibold hover:opacity-90 transition"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===============================
                BOOKING DRAWER
            =============================== */}
            {selectedService && (
                <HouseholdBookingDrawer
                    service={selectedService}
                    userLocation={null}
                    onClose={() => setSelectedService(null)}
                    onSuccess={() => {}}
                />
            )}
        </div>
    );
};

export default HouseholdServices;
