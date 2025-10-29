import { useState } from 'react';
import { MapPin, Navigation, Clock, Star, Shield, Check } from 'lucide-react';

const Transport = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Show vehicles only when both locations are filled
  const showVehicles = pickup.trim() !== '' && dropoff.trim() !== '';

  const vehicles = [
    {
      id: 1,
      name: 'uniRide Bike',
      type: 'Bike',
      description: 'Eco-friendly & quick',
      capacity: '1 person',
      time: '8-12 min',
      price: 50,
      rating: 4.8,
      features: ['Helmet provided', 'GPS tracking'],
      icon: '🏍️',
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'uniRide Mini',
      type: 'Car',
      description: 'Comfortable sedan',
      capacity: '4 persons',
      time: '10-15 min',
      price: 150,
      rating: 4.7,
      features: ['AC available', 'GPS tracking'],
      icon: '🚗',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'uniRide SUV',
      type: 'SUV',
      description: 'Spacious & premium',
      capacity: '6 persons',
      time: '12-18 min',
      price: 280,
      rating: 4.9,
      features: ['Premium comfort', 'GPS tracking'],
      icon: '🚙',
      color: 'bg-purple-500'
    }
  ];

  const handleBookRide = () => {
    setIsBooking(true);
    
    const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
    
    // Simulate booking API call
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      
      console.log('Booking Details:', {
        pickup,
        dropoff,
        vehicle: selectedVehicleData,
        timestamp: new Date().toISOString()
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
        setPickup('');
        setDropoff('');
        setSelectedVehicle(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Book Your Ride</h1>
          <p className="text-lg text-gray-600">Choose from bikes, cars, or SUVs for your journey</p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-fade-in">
            <Check className="w-6 h-6" />
            <div>
              <p className="font-semibold">Ride Booked Successfully!</p>
              <p className="text-sm">Your driver will arrive shortly</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Trip Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h2>

              {/* Pickup Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Drop-off Location */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    placeholder="Enter drop-off location"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Choose Vehicle - Only show when both locations are filled */}
              {showVehicles ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Vehicle</h3>
                  
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                        className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          selectedVehicle === vehicle.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className={`${vehicle.color} w-16 h-16 rounded-xl flex items-center justify-center text-3xl`}>
                              {vehicle.icon}
                            </div>

                            {/* Vehicle Info */}
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{vehicle.name}</h4>
                              <p className="text-sm text-gray-600">{vehicle.description}</p>
                              <p className="text-sm text-gray-500 mt-1">Capacity: {vehicle.capacity}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{vehicle.time}</span>
                              </div>
                              
                              {/* Features */}
                              <div className="flex gap-2 mt-3">
                                {vehicle.features.map((feature, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Price and Rating */}
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">₹{vehicle.price}</div>
                            <div className="flex items-center gap-1 mt-2 justify-end">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">{vehicle.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Book Button */}
                  <button 
                    onClick={handleBookRide}
                    disabled={!selectedVehicle || isBooking}
                    className={`w-full mt-8 font-semibold py-4 rounded-xl transition-colors ${
                      selectedVehicle && !isBooking
                        ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </span>
                    ) : selectedVehicle ? (
                      'Book Ride'
                    ) : (
                      'Select a Vehicle'
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Enter pickup and drop-off locations to see available vehicles
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Live Tracking & Safety */}
          <div className="space-y-6">
            {/* Live Route Tracking */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-6 rounded-full">
                  <Navigation className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <Navigation className="inline w-5 h-5 mr-2" />
                Live Route Tracking
              </h3>
              <p className="text-lg font-semibold text-gray-700 mb-2">Real-time GPS tracking</p>
              <p className="text-sm text-gray-600">
                Track your ride in real-time once booked
              </p>
            </div>

            {/* Safety First */}
            <div className="bg-green-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Safety First</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>All drivers are verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Emergency SOS button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Share trip with loved ones</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;
