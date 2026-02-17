import { useEffect, useState } from "react";
import { MapPin, Loader2, Star } from "lucide-react";
import MapComponent from "../components/maps/MapComponent";
import HouseholdBookingDrawer from "./HouseholdBookingDrawer";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const HouseholdMap = () => {
    const [location, setLocation] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    /* ===============================
       GET USER LOCATION
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
                // Fallback: Delhi
                setLocation({ lat: 28.6139, lng: 77.209 });
            },
            { enableHighAccuracy: true }
        );
    }, []);

    /* ===============================
       FETCH NEARBY SERVICES
    =============================== */
    useEffect(() => {
        if (!location) return;

        const fetchNearby = async () => {
            try {
                setLoading(true);

                const res = await fetch(`${API_BASE}/services/nearby`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        lat: location.lat,
                        lng: location.lng,
                    }),
                });

                const data = await res.json();

                if (!res.ok) throw new Error("Failed to load nearby services");

                setServices(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNearby();
    }, [location]);

    /* ===============================
       MAP MARKERS
    =============================== */
    const markers = location
        ? [
            {
                position: [location.lat, location.lng],
                emoji: "📍",
                popup: "Your Location",
            },
            ...services.map((s) => ({
                position: [location.lat, location.lng], // demo-based
                emoji: "🛠️",
                popup: s.name,
            })),
        ]
        : [];

    /* ===============================
       UI STATES
    =============================== */
    if (!location || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <MapPin className="w-14 h-14 text-red-500 mb-4" />
                <p className="font-semibold text-lg">Unable to load services</p>
                <p className="text-gray-500 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-10">

            {/* ===============================
                MAP SECTION
            =============================== */}
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <MapComponent
                    center={[location.lat, location.lng]}
                    markers={markers}
                    height="460px"
                />
            </div>

            {/* ===============================
                HEADER
            =============================== */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <h1 className="text-4xl font-extrabold mb-2">
                    Services Near You
                </h1>
                <p className="text-gray-600 text-lg">
                    Professionals available around your location
                </p>
            </div>

            {/* ===============================
                SERVICES LIST
            =============================== */}
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {services.map((service) => (
                    <div
                        key={service._id}
                        className="bg-white rounded-3xl shadow-lg p-6 
                                   hover:shadow-2xl transition 
                                   transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold mb-1">
                            {service.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-3">
                            {service.category?.name}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            {service.rating || 4.6}
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-green-700">
                                ₹{service.basePrice}
                            </span>

                            <button
                                onClick={() => setSelectedService(service)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 
                                           text-white px-6 py-2 rounded-xl 
                                           font-semibold hover:opacity-90 transition"
                            >
                                Book
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
                    userLocation={location}
                    onClose={() => setSelectedService(null)}
                    onSuccess={() => { }}
                />
            )}
        </div>
    );
};

export default HouseholdMap;
