import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL + "/household";

const HouseholdCategories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ===============================
       FETCH CATEGORIES
    =============================== */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/categories`);
                const data = await res.json();

                if (!res.ok) throw new Error("Failed to load categories");

                setCategories(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
                    Unable to load household services
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
            <div className="max-w-7xl mx-auto text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                    Household Services
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Choose from trusted professionals for every household need
                </p>
            </div>

            {/* ===============================
                CATEGORY GRID
            =============================== */}
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                {categories.map((category) => (
                    <div
                        key={category._id}
                        onClick={() =>
                            navigate(`/household/services?category=${category._id}`)
                        }
                        className="group bg-white rounded-3xl p-6 shadow-lg cursor-pointer 
                                   hover:shadow-2xl transition-all duration-300 
                                   transform hover:-translate-y-2"
                    >
                        {/* ICON */}
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br 
                                        from-green-500 to-emerald-600 
                                        flex items-center justify-center mb-6 
                                        group-hover:scale-110 transition">
                            <span className="text-3xl text-white">
                                {category.icon || "🛠️"}
                            </span>
                        </div>

                        {/* TITLE */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {category.name}
                        </h3>

                        {/* SUBTEXT */}
                        <p className="text-sm text-gray-600 mb-6">
                            Professional {category.name.toLowerCase()} services
                        </p>

                        {/* CTA */}
                        <div className="flex items-center text-green-600 font-semibold gap-2 
                                        group-hover:gap-3 transition-all">
                            Explore Services
                            <ArrowRight size={18} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HouseholdCategories;
