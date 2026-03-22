import { useEffect, useState } from "react";
import { Search, Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/maps/MapComponent";
import HouseholdBookingDrawer from "./HouseholdBookingDrawer";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const HouseholdHome = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [location, setLocation] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [search, setSearch] = useState("");

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

    useEffect(() => {
        fetch(`${API_BASE}/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data.data || []));
    }, []);

    useEffect(() => {
        const url = activeCategory
            ? `${API_BASE}/services?category=${activeCategory}`
            : `${API_BASE}/services`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => setServices(data.data || []));
    }, [activeCategory]);

    const filteredServices = services.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.category?.name.toLowerCase().includes(search.toLowerCase())
    );

    const markers = filteredServices.map((s) => ({
        position: location
            ? [location.lat, location.lng]
            : [28.6139, 77.209],
        emoji: "🏠",
        popup: s.name,
    }));

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-white">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Household Services
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Trusted professionals at your doorstep
                    </p>
                </div>

                <button
                    onClick={() => navigate("/household/bookings")}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
                >
                    <Calendar size={18} />
                    My Bookings
                </button>
            </div>

            {/* MAIN LAYOUT */}
            <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* MAP */}
                <div className="lg:col-span-4"> {/* ✅ was 5 */}
                    {location && (
                        <div className="sticky top-24 rounded-3xl overflow-hidden shadow-xl">
                            <MapComponent
                                center={[location.lat, location.lng]}
                                markers={markers}
                                height="300px"
                            />
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="lg:col-span-8 space-y-8"> {/* ✅ was 7 */}

                    {/* SEARCH */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search services or categories"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border bg-white shadow-sm focus:ring-2 focus:ring-pink-400 outline-none"
                        />
                    </div>

                    {/* CATEGORY SLIDER */}
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition ${!activeCategory
                                    ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                                    : "bg-white border hover:bg-gray-100"
                                }`}
                        >
                            All
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setActiveCategory(cat._id)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition ${activeCategory === cat._id
                                        ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                                        : "bg-white border hover:bg-gray-100"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* SERVICES GRID */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* ✅ more space */}
                        {filteredServices.map((service) => (
                            <div
                                key={service._id}
                                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col min-h-[230px]"
                            >
                                <h3 className="text-xl font-bold mb-1">
                                    {service.name}
                                </h3>

                                <p className="text-sm text-gray-500 mb-3">
                                    {service.category?.name}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {service.rating || 4.6}
                                </div>

                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-lg font-bold text-violet-600">
                                        ₹{service.basePrice}
                                    </span>

                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* BOOKING DRAWER */}
            {selectedService && location && (
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

export default HouseholdHome;