import { useState, useEffect } from 'react'
import { foodAPI } from '../services/api'
import MapComponent from '../components/maps/MapComponent'
import { Card } from '../components/ui/card'
import Button from '../components/ui/button'
import { UtensilsCrossed, Star, Clock, MapPin, ShoppingBag, Plus, Minus, X, Search } from 'lucide-react'

// Utility for distance calculations
function haversine([lat1, lon1], [lat2, lon2]) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const MAX_RESTAURANTS = 15
const RADIUS_DECIMAL = 0.004 // about 400m visual scatter

const Food = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState([19.0760, 72.8777])
  const [showCart, setShowCart] = useState(false)
  const [search, setSearch] = useState("")
  const [address, setAddress] = useState("")
  const [checkoutStep, setCheckoutStep] = useState("cart")
  const [payMethod, setPayMethod] = useState("upi")
  const [showAdded, setShowAdded] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    fetchRestaurants()
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await foodAPI.getRestaurants()
      setRestaurants(response.data.data)
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cart management
  const addToCart = (item, restaurant) => {
    const existing = cart.find(i => i._id === item._id)
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setCart([...cart, { ...item, quantity: 1, restaurantId: restaurant._id, restaurantName: restaurant.name, deliveryFee: restaurant.deliveryFee }])
    }
    setSelectedRestaurant(restaurant)
    setShowAdded(true)
    setTimeout(() => setShowAdded(false), 1300)
  }

  const removeFromCart = (itemId) => setCart(cart.filter(i => i._id !== itemId))
  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(i => {
      if (i._id === itemId) {
        const newQty = i.quantity + delta
        return newQty > 0 ? { ...i, quantity: newQty } : i
      }
      return i
    }).filter(i => i.quantity > 0))
  }

  // Generate sample restaurant markers around user
  const restaurantMarkers = restaurants.length
    ? Array.from({ length: Math.min(restaurants.length, MAX_RESTAURANTS) }).map((_, i) => {
        const angle = Math.random() * 2 * Math.PI
        const radius = Math.random() * RADIUS_DECIMAL
        return {
          position: [
            userLocation[0] + radius * Math.cos(angle),
            userLocation[1] + radius * Math.sin(angle)
          ],
          popup: restaurants[i].name,
          emoji: "🍽️"
        }
      })
    : []

  const markers = [
    { position: userLocation, popup: "You", emoji: "🧑‍🍳" },
    ...restaurantMarkers
  ]

  const foodTerm = search.trim().toLowerCase()
  const filteredResults = foodTerm
    ? restaurants
      .map(r => ({
        ...r,
        menu: r.menu.filter(item => item.name.toLowerCase().includes(foodTerm))
      }))
      .filter(r => r.menu.length)
    : restaurants

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = cart.length > 0 ? cart[0].deliveryFee : 0
  const fullTotal = cartTotal + deliveryFee + Math.round(cartTotal * 0.05)

  const canProceed = cart.length > 0 && address.trim() && (payMethod === "upi" || payMethod === "cod")
  const handlePlaceOrder = async () => {
    if (!canProceed || orderLoading) return
    setOrderLoading(true)
    try {
      const res = await foodAPI.createOrder({
        restaurantId: cart[0].restaurantId,
        items: cart.map(i => ({
          menuItem: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        deliveryAddress: {
          address,
          coordinates: userLocation,
        }
      })
      await foodAPI.updatePayment(res.data.data._id, {
        paymentId: `pay_${Date.now()}`,
        paymentStatus: 'completed'
      })
      setPaymentSuccess(true)
      setOrderLoading(false)
      setCart([])
      setCheckoutStep("cart")
      setTimeout(() => {
        setPaymentSuccess(false)
        setShowCart(false)
        setAddress("")
        setPayMethod("upi")
      }, 3500)
    } catch (e) {
      setOrderLoading(false)
      alert('Order failed. Try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading delicious food...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12">
      <div className="mx-auto max-w-7xl px-5">

        {/* Header row, search and map */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-7 gap-4 md:gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed className="h-7 w-7 text-orange-400" />
              <h1 className="font-extrabold text-3xl md:text-4xl">Food Delivery</h1>
            </div>
            <div className="text-gray-600 text-lg mb-6">
              Discover best dishes near you, from local cafes to top restaurants.
            </div>
            <div className="w-full">
              <div className="relative w-full">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for food (e.g. pizza, biryani, dosa)..."
                  className="w-full shadow-md rounded-2xl border border-gray-200 focus:border-orange-400 text-lg px-6 py-4 placeholder-gray-400 transition pr-12"
                />
                <Search className="absolute top-1/2 right-4 transform -translate-y-1/2 text-orange-400" size={26} />
              </div>
            </div>
          </div>
          <div className="rounded-3xl shadow-2xl border-4 border-orange-100 overflow-hidden mt-8 md:mt-0" style={{ width: "410px", height: "260px", minWidth: "340px" }}>
            <MapComponent center={userLocation} markers={markers} zoom={15} height="100%" />
          </div>
        </div>

        {/* Show order success toast */}
        {paymentSuccess && (
          <div className="fixed top-14 left-0 right-0 flex justify-center z-50 pointer-events-none animate-fade-in-down">
            <div className="bg-green-500 shadow-2xl text-white px-8 py-4 rounded-2xl flex items-center gap-4 max-w-lg mx-auto text-lg font-semibold">
              🎉 Hurray! Your order has been placed successfully!
            </div>
          </div>
        )}

        {/* Cart toast */}
        {showAdded && (
          <div className="fixed bottom-24 right-7 z-50 bg-green-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg animate-fade-in">
            Added to cart!
          </div>
        )}

        {/* Restaurant and Menu List */}
        <div className="space-y-8">
          {filteredResults.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-xl">
              No results found for "{search}"
            </div>
          )}
          {filteredResults.map(restaurant => (
            <Card
              key={restaurant._id}
              id={`rest_${restaurant._id}`}
              className={`overflow-hidden border-2 border-gray-100 transition-all bg-white hover:border-orange-300`}
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{restaurant.name}</h3>
                    <p className="text-orange-100 mb-2">{restaurant.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white bg-opacity-15 px-3 py-1 rounded-full text-sm">
                        {restaurant.cuisine.join(', ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-current text-yellow-300" /><span className="font-semibold">{restaurant.rating}</span></div>
                      <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{restaurant.deliveryTime}</span></div>
                      <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /><span>{restaurant.location.address}</span></div>
                    </div>
                  </div>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-28 h-28 rounded-xl object-cover shadow-lg hidden md:block"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span>Min Order: ₹{restaurant.minOrder}</span>
                  <span>·</span>
                  <span>Delivery: ₹{restaurant.deliveryFee}</span>
                  <span>·</span>
                  <span>{restaurant.openingHours}</span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                  Menu
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurant.menu.map(item => (
                    <div key={item._id} className="bg-white rounded-xl border-2 border-gray-100 hover:border-orange-300 overflow-hidden transition-all hover:shadow-lg">
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                        />
                        {item.vegetarian && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            VEG
                          </span>
                        )}
                        {!item.vegetarian && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NON-VEG
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h5 className="font-bold text-lg mb-1 text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                          <Button
                            onClick={() => addToCart(item, restaurant)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 text-sm"
                            disabled={!item.available}
                          >
                            {item.available ? (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            ) : (
                              'Out of Stock'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <button
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 text-white font-bold"
          >
            <ShoppingBag className="h-6 w-6" />
            {cart.length} items
            <span className="bg-white text-orange-600 px-3 py-1 rounded-full font-bold ml-2">
              ₹{cartTotal + deliveryFee}
            </span>
          </button>
        )}

        {/* Cart Drawer + Address + Payment */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto rounded-l-3xl shadow-xl p-5 relative flex flex-col">
              <button onClick={() => setShowCart(false)} className="absolute top-6 right-6 text-gray-600 hover:text-gray-900">
                <X className="h-6 w-6"/>
              </button>
              {paymentSuccess ? (
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="rounded-full h-16 w-16 flex items-center justify-center bg-green-500 text-white text-4xl mb-6">✓</div>
                  <div className="text-xl font-bold text-green-600">Order Successful!</div>
                  <div className="mt-2 text-gray-500 text-center">Your food is on the way 🚗</div>
                </div>
              ) : checkoutStep === "cart" ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                      <ShoppingBag className="h-20 w-20 mb-5" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-5 mb-6">
                        {cart.map(item => (
                          <div key={item._id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div className="flex gap-3 items-center">
                              <img src={item.image} className="w-16 h-16 rounded-lg object-cover"/>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                                <div className="text-orange-600 font-semibold mb-1">₹{item.price}</div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => updateQuantity(item._id, -1)} className="bg-orange-100 text-orange-600 w-7 h-7 rounded-lg font-bold hover:bg-orange-200">
                                    <Minus className="h-4 w-4 mx-auto"/>
                                  </button>
                                  <span className="font-bold text-lg">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item._id, 1)} className="bg-orange-100 text-orange-600 w-7 h-7 rounded-lg font-bold hover:bg-orange-200">
                                    <Plus className="h-4 w-4 mx-auto"/>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600">
                              <X className="h-5 w-5"/>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="bg-orange-50 rounded-xl p-5 mb-6">
                        <div className="flex justify-between mb-2"><span>Subtotal</span><span className="font-bold">₹{cartTotal}</span></div>
                        <div className="flex justify-between mb-2"><span>Delivery Fee</span><span className="font-bold">₹{deliveryFee}</span></div>
                        <div className="flex justify-between mb-1"><span>Taxes</span><span className="font-bold">₹{Math.round(cartTotal * 0.05)}</span></div>
                        <div className="border-t border-orange-300 pt-3 flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-orange-600">₹{fullTotal}</span>
                        </div>
                      </div>
                      <Button
                        className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-lg text-lg rounded-xl"
                        onClick={() => setCheckoutStep("address")}
                      >
                        Checkout
                      </Button>
                    </>
                  )}
                </>
              ) : checkoutStep === "address" ? (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-4 py-3 text-lg mb-6"
                    value={address}
                    placeholder="Enter delivery address..."
                    onChange={e => setAddress(e.target.value)}
                  />
                  <Button
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-lg text-lg rounded-xl mb-4"
                    onClick={() => setCheckoutStep("payment")}
                    disabled={!address.trim()}
                  >
                    Continue to Payment
                  </Button>
                  <Button
                    className="w-full py-3 bg-gray-200 text-gray-800 font-bold rounded-xl"
                    onClick={() => setCheckoutStep("cart")}
                  >
                    Back to Cart
                  </Button>
                </div>
              ) : checkoutStep === "payment" ? (
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-5">Choose Payment Method</h2>
                  <div className="flex flex-col gap-4 mb-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payMethod"
                        value="upi"
                        checked={payMethod === "upi"}
                        onChange={() => setPayMethod("upi")}
                        className="accent-orange-600"
                      />
                      <span className="font-semibold">UPI / Online</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payMethod"
                        value="cod"
                        checked={payMethod === "cod"}
                        onChange={() => setPayMethod("cod")}
                        className="accent-orange-600"
                      />
                      <span className="font-semibold">Cash on Delivery</span>
                    </label>
                  </div>
                  <Button
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-lg text-lg rounded-xl"
                    onClick={handlePlaceOrder}
                    disabled={orderLoading || !canProceed}
                  >
                    {orderLoading ? "Processing..." : `Pay ₹${fullTotal}`}
                  </Button>
                  <Button
                    className="w-full py-3 mt-4 bg-gray-200 text-gray-800 font-bold rounded-xl"
                    onClick={() => setCheckoutStep("address")}
                  >
                    Back to Address
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


export default Food