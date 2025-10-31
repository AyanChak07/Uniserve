import { useEffect, useRef, useState } from "react";
import MapComponent from "../components/maps/MapComponent";
import { MapPin, CheckCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/transport";

const vehicleTypes = {
  Bike: { icon: "🏍️", color: "bg-green-500" },
  Car: { icon: "🚗", color: "bg-blue-500" },
  SUV: { icon: "🚙", color: "bg-purple-500" },
};

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function Transport() {
  const [userLocation, setUserLocation] = useState([28.6139, 77.209]);
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoff, setDropoff] = useState("");
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingState, setBookingState] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [lastBooking, setLastBooking] = useState(null);

  const pickupDebounce = useRef(null);
  const dropoffDebounce = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  const fetchSuggestions = (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=5`
    )
      .then((res) => res.json())
      .then((json) => setSuggestions(json))
      .catch(() => setSuggestions([]));
  };

  const handlePickupChange = (e) => {
    const val = e.target.value;
    setPickup(val);
    if (pickupDebounce.current) clearTimeout(pickupDebounce.current);
    pickupDebounce.current = setTimeout(() => {
      fetchSuggestions(val, setPickupSuggestions);
    }, 400);
  };

  const handleDropoffChange = (e) => {
    const val = e.target.value;
    setDropoff(val);
    if (dropoffDebounce.current) clearTimeout(dropoffDebounce.current);
    dropoffDebounce.current = setTimeout(() => {
      fetchSuggestions(val, setDropoffSuggestions);
    }, 400);
  };

  const onSelectPickupSuggestion = (place) => {
    setPickup(place.display_name);
    setPickupCoords([parseFloat(place.lat), parseFloat(place.lon)]);
    setPickupSuggestions([]);
  };

  const onSelectDropoffSuggestion = (place) => {
    setDropoff(place.display_name);
    setDropoffCoords([parseFloat(place.lat), parseFloat(place.lon)]);
    setDropoffSuggestions([]);
  };

  const useCurrentLocation = () => {
    setPickup("Current Location");
    setPickupCoords(userLocation);
    setPickupSuggestions([]);
  };

  const uniqueVehicles = [
    {
      id: 1,
      type: "Bike",
      pricePerKm: 7,
      eta: "3-5 min",
      capacity: "1 person",
      ...vehicleTypes.Bike,
      emoji: "🏍️",
    },
    {
      id: 2,
      type: "Car",
      pricePerKm: 15,
      eta: "5-7 min",
      capacity: "4 persons",
      ...vehicleTypes.Car,
      emoji: "🚗",
    },
    {
      id: 3,
      type: "SUV",
      pricePerKm: 20,
      eta: "7-12 min",
      capacity: "6 persons",
      ...vehicleTypes.SUV,
      emoji: "🚙",
    },
  ];

  const showVehicles = pickupCoords && dropoffCoords;

  const getDistanceKm = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculatePrice = (vehicleId) => {
    if (!pickupCoords || !dropoffCoords) return 0;
    const distance = getDistanceKm(pickupCoords, dropoffCoords);
    const vehicle = uniqueVehicles.find((v) => v.id === vehicleId);
    return Math.round(distance * vehicle.pricePerKm);
  };

  // Markers (user, pickup, dropoff)
  const mapMarkers = [];
  if (userLocation) mapMarkers.push({ position: userLocation, popup: "Your Location" });
  if (pickupCoords && pickup !== "Current Location")
    mapMarkers.push({ position: pickupCoords, popup: "Pickup Location" });
  else if (pickup === "Current Location")
    mapMarkers.push({ position: userLocation, popup: "Pickup (You)" });
  if (dropoffCoords) mapMarkers.push({ position: dropoffCoords, popup: "Drop-off Location" });

  // Sample vehicles scattered around
  const nearbyVehiclesMarkers = [];
  if (showVehicles) {
    for (let i = 0; i < 6; i++) {
      const v = uniqueVehicles[i % uniqueVehicles.length];
      const angle = Math.random() * 2 * Math.PI;
      const radius = 0.001 + Math.random() * 0.0007; // ~100-200m
      nearbyVehiclesMarkers.push({
        position: [
          userLocation[0] + Math.cos(angle) * radius,
          userLocation[1] + Math.sin(angle) * radius,
        ],
        popup: `${v.emoji} ${v.type}`,
        emoji: v.emoji,
      });
    }
  }

  const markers = [...mapMarkers, ...nearbyVehiclesMarkers];
  const routeLine = pickupCoords && dropoffCoords ? [pickupCoords, dropoffCoords] : null;

  const createBookingBackend = async (bookingData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(bookingData),
      });
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        let errMsg = "Failed to create booking";
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          errMsg = data.message || errMsg;
        }
        throw new Error(errMsg);
      }
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      } else {
        throw new Error("Server did not return JSON.");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleBookRide = async () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle.");
      return;
    }
    if (!pickupCoords || !dropoffCoords) {
      alert("Please select both pickup and drop-off locations.");
      return;
    }

    setBookingState({ loading: true, success: false, error: null });

    let typeStr;
    if (selectedVehicle === 1) typeStr = "bike";
    else if (selectedVehicle === 2) typeStr = "car";
    else if (selectedVehicle === 3) typeStr = "suv";

    let vehicleId = null;
    // ✅ Better: Add error logging and handle response properly
    try {
      const token = localStorage.getItem("token");
      const vehiclesRes = await fetch(`${API_BASE_URL}/vehicles?type=${typeStr}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      
      const vehiclesJson = await vehiclesRes.json();
      
      if (!vehiclesRes.ok) {
        throw new Error(vehiclesJson.message || 'Failed to fetch vehicles');
      }
      
      if (vehiclesJson.success && vehiclesJson.data && vehiclesJson.data.length > 0) {
        vehicleId = vehiclesJson.data[0]._id;
      } else {
        throw new Error("No matching vehicles available for type: " + typeStr);
      }
    } catch (e) {
      console.error('Vehicle fetch error:', e);
      setBookingState({ 
        loading: false, 
        success: false, 
        error: e.message || "Failed to get available vehicle." 
      });
      return;
    }


    const fare = calculatePrice(selectedVehicle);
    const distance = getDistanceKm(pickupCoords, dropoffCoords);

    setLastBooking({
      vehicleId,
      vehicleLocalId: selectedVehicle,
      fare,
      pickup,
      dropoff,
      driver: {
        name: "Rahul Sinha",
        phone: "+91-9876543210",
      },
      vehicle: uniqueVehicles.find((v) => v.id === selectedVehicle),
      distance,
    });

    const bookingPayload = {
      vehicleId,
      pickup: {
        address: pickup,
        coordinates: pickupCoords,
      },
      dropoff: {
        address: dropoff,
        coordinates: dropoffCoords,
      },
      distance,
      fare,
      scheduledTime: new Date(),
    };

    try {
      await createBookingBackend(bookingPayload);
      setBookingState({ loading: false, success: true, error: null });

      setTimeout(() => {
        setBookingState({ loading: false, success: false, error: null });
        setPickup("");
        setDropoff("");
        setPickupCoords(null);
        setDropoffCoords(null);
        setSelectedVehicle(null);
        setLastBooking(null);
      }, 4000);
    } catch (error) {
      setBookingState({ loading: false, success: false, error: error.message || "Failed to book ride" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-blue-50 to-slate-100 py-12 px-6 flex flex-col items-center gap-10 font-sans">
      <h1 className="text-5xl font-extrabold mb-3 text-indigo-900 text-center">Book Your Ride</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Choose from bikes, cars, or SUVs for your journey with live location and map view.
      </p>

      {/* Success Toast positioned fixed at top-center */}
      {bookingState.success && (
        <div className="fixed top-8 left-0 right-0 flex justify-center z-[999] pointer-events-none">
          <div className="bg-green-500 text-white px-8 py-4 rounded-2xl flex items-center gap-4 animate-fade-in-down text-lg font-semibold max-w-lg mx-auto shadow-lg pointer-events-auto">
            <CheckCircle className="text-2xl" />
            Ride booked! Driver on the way 🚗
          </div>
        </div>
      )}

      {/* Ride details shown after booking - centered with higher z-index */}
      {bookingState.success && lastBooking && (
        <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-green-500 shadow-2xl rounded-2xl w-full max-w-md py-8 px-8 flex flex-col items-center animate-fade-in-up pointer-events-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{lastBooking.vehicle?.emoji || "🚗"}</span>
            <div>
              <div className="font-bold text-2xl">{lastBooking.vehicle?.type || "Vehicle"}</div>
              <div className="text-md text-gray-400">Your driver is arriving soon</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full text-center text-gray-700 text-sm mb-3">
            <div>
              <span className="font-bold">Driver:</span> {lastBooking.driver.name}{" "}
              <span className="text-gray-400">|</span>{" "}
              <span className="font-semibold">{lastBooking.vehicle?.type}</span>
            </div>
            <div>
              <span className="font-bold">Contact:</span>{" "}
              <a href={`tel:${lastBooking.driver.phone}`} className="text-green-700 font-semibold hover:underline">
                {lastBooking.driver.phone}
              </a>
            </div>
            <div>
              <span className="font-bold">Pickup:</span> {lastBooking.pickup}
            </div>
            <div>
              <span className="font-bold">Drop-off:</span> {lastBooking.dropoff}
            </div>
            <div>
              <span className="font-bold">Fare:</span> ₹{lastBooking.fare}
            </div>
            <div className="mt-1 text-green-600 font-semibold">Enjoy your ride! 🚦</div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-md font-bold shadow hover:bg-green-600 transition"
              onClick={() => {
                window.open(`tel:${lastBooking.driver.phone}`);
              }}
            >
              Contact Driver
            </button>
            <button
              className="bg-black text-white px-5 py-2 rounded-md font-bold shadow hover:bg-gray-800 transition"
              onClick={() => alert("Tracking feature not implemented yet.")}
            >
              Track Ride
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {bookingState.error && (
        <div className="fixed top-8 left-0 right-0 flex justify-center z-[999] pointer-events-none">
          <div className="bg-red-500 text-white px-8 py-4 rounded-2xl flex items-center gap-2 animate-fade-in-down font-semibold max-w-lg mx-auto shadow-lg pointer-events-auto">
            Error: {bookingState.error}
          </div>
        </div>
      )}

      <div className="flex w-full max-w-7xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Left column */}
        <div className="w-full max-w-md p-8 space-y-6">
          {/* Pickup input */}
          <div className="relative">
            <label className="font-semibold text-gray-600 block mb-2 text-lg">Pickup Location</label>
            <input
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              placeholder="Enter pickup location"
              autoComplete="off"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition"
            />
            {(pickupSuggestions.length > 0 || pickup.length === 0) && (
              <div className="absolute left-0 right-0 bg-white border border-t-0 rounded-b-xl shadow-xl z-30 max-h-64 overflow-auto">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-green-700 hover:bg-green-50 border-b border-gray-200 rounded-t-xl bg-green-50"
                >
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>
                    <b>Pickup:</b> Use my current location
                  </span>
                </button>
                {pickupSuggestions.map((s) => (
                  <button
                    key={s.place_id}
                    type="button"
                    onClick={() => onSelectPickupSuggestion(s)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 border-gray-100 text-base"
                  >
                    {s.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropoff input */}
          <div className="relative">
            <label className="font-semibold text-gray-600 block mb-2 text-lg">Drop-off Location</label>
            <input
              type="text"
              value={dropoff}
              onChange={handleDropoffChange}
              placeholder="Enter drop-off location"
              autoComplete="off"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition"
            />
            {dropoffSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border border-t-0 rounded-b-xl shadow-xl z-30 max-h-64 overflow-auto">
                {dropoffSuggestions.map((s) => (
                  <button
                    key={s.place_id}
                    type="button"
                    onClick={() => onSelectDropoffSuggestion(s)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 border-gray-100 text-base"
                  >
                    {s.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance & Price */}
          {showVehicles && (
            <div className="my-4 bg-gray-100 p-4 rounded-xl text-center font-semibold text-gray-700">
              <span className="font-semibold">Distance:</span>{" "}
              {getDistanceKm(pickupCoords, dropoffCoords).toFixed(2)} km
              <br />
              <span className="font-semibold">Estimated Price:</span>{" "}
              {selectedVehicle ? `₹${calculatePrice(selectedVehicle)}` : "(select a vehicle)"}
            </div>
          )}

          {/* Vehicles */}
          {showVehicles ? (
            <>
              <h3 className="text-xl font-semibold mb-4">Choose Vehicle</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {uniqueVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`flex justify-between items-center cursor-pointer p-5 border-2 rounded-xl transition ${
                      selectedVehicle === vehicle.id
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`text-4xl ${vehicle.color}`} aria-label={vehicle.type}>
                        {vehicle.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-lg text-gray-800">{vehicle.type}</div>
                        <div className="text-sm text-gray-600">Capacity: {vehicle.capacity}</div>
                        <div className="text-xs text-gray-500 mt-1">{vehicle.eta} away</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg">₹{vehicle.pricePerKm} / km</span>
                      <span className="text-gray-600 text-sm mt-1">
                        Total: {showVehicles ? `₹${calculatePrice(vehicle.id)}` : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                disabled={!selectedVehicle || bookingState.loading}
                onClick={handleBookRide}
                className={`w-full py-3 mt-6 font-semibold rounded-lg transition-colors ${
                  selectedVehicle && !bookingState.loading
                    ? "bg-black text-white cursor-pointer hover:bg-gray-900"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {bookingState.loading ? "Booking..." : "Book Ride"}
              </button>
            </>
          ) : (
            <div className="text-center mt-20 text-gray-400">
              Enter both pickup & drop-off locations to see available vehicles.
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 max-w-3xl p-6 border-l border-gray-200 rounded-tr-3xl rounded-br-3xl shadow-lg">
          <MapComponent center={userLocation} markers={markers} zoom={13} height="500px" routeLine={routeLine} />
        </div>
      </div>
    </div>
  );
}