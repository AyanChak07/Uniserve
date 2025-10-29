import { useState, useEffect } from 'react'
import { foodAPI } from '../services/api'
import MapComponent from '../components/maps/MapComponent'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import Button from '../components/ui/button'
import { UtensilsCrossed, Star, Clock, MapPin, ShoppingBag, Plus, Minus, X } from 'lucide-react'

const Food = () => {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState([19.0760, 72.8777])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetchRestaurants()
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

  const addToCart = (item, restaurant) => {
    const existing = cart.find(i => i._id === item._id)
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setCart([...cart, { ...item, quantity: 1, restaurantId: restaurant._id, restaurantName: restaurant.name, deliveryFee: restaurant.deliveryFee }])
    }
    setShowCart(true)
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i._id !== itemId))
  }

  const updateQuantity = (itemId, delta) => {
    setCart(cart.map(i => {
      if (i._id === itemId) {
        const newQty = i.quantity + delta
        return newQty > 0 ? { ...i, quantity: newQty } : i
      }
      return i
    }).filter(i => i.quantity > 0))
  }

  const handleOrder = async () => {
    if (cart.length === 0 || !selectedRestaurant) {
      alert('Please select items to order')
      return
    }

    try {
      const orderData = {
        restaurantId: selectedRestaurant._id,
        items: cart.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: {
          address: 'Current Location',
          coordinates: userLocation,
        },
      }

      const response = await foodAPI.createOrder(orderData)
      
      await foodAPI.updatePayment(response.data.data._id, {
        paymentId: `pay_${Date.now()}`,
        paymentStatus: 'completed',
      })

      alert('🎉 Order placed successfully!')
      setCart([])
      setSelectedRestaurant(null)
      setShowCart(false)
    } catch (error) {
      alert('Order failed: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  const markers = restaurants.map(restaurant => ({
    position: [restaurant.location.coordinates[1], restaurant.location.coordinates[0]],
    popup: restaurant.name,
  }))

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = cart.length > 0 ? cart[0].deliveryFee : 0

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full mb-4">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="text-sm font-semibold">Food Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Order Delicious Food</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore restaurants near you and get food delivered to your doorstep
          </p>
        </div>

        {/* Map Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-600" />
              Restaurants Near You
            </h2>
          </CardHeader>
          <CardContent>
            <MapComponent
              center={userLocation}
              markers={markers}
              zoom={13}
              height="300px"
            />
          </CardContent>
        </Card>

        {/* Restaurants List */}
        <div className="space-y-8">
          {restaurants.map(restaurant => (
            <Card key={restaurant._id} className="overflow-hidden border-2 border-gray-100 hover:border-orange-200 transition-all">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-2">{restaurant.name}</h3>
                    <p className="text-orange-100 mb-3">{restaurant.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        {restaurant.cuisine.join(', ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-300" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{restaurant.location.address}</span>
                      </div>
                    </div>
                  </div>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-32 h-32 rounded-xl object-cover shadow-lg hidden md:block"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span>Min Order: ₹{restaurant.minOrder}</span>
                  <span>•</span>
                  <span>Delivery: ₹{restaurant.deliveryFee}</span>
                  <span>•</span>
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
                      {/* Food Image */}
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
                            onClick={() => {
                              setSelectedRestaurant(restaurant)
                              addToCart(item, restaurant)
                            }}
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
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center gap-3"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold">{cart.length} items</span>
          <span className="bg-white text-orange-600 px-3 py-1 rounded-full font-bold">
            ₹{cartTotal + deliveryFee}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="hover:bg-white hover:bg-opacity-20 rounded-full p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>
              {selectedRestaurant && (
                <p className="text-orange-100 mt-2">{selectedRestaurant.name}</p>
              )}
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item._id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-orange-600 font-bold mb-2">₹{item.price}</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(item._id, -1)}
                                className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg font-bold hover:bg-orange-200 transition-colors"
                              >
                                <Minus className="h-4 w-4 mx-auto" />
                              </button>
                              <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, 1)}
                                className="bg-orange-100 text-orange-600 w-8 h-8 rounded-lg font-bold hover:bg-orange-200 transition-colors"
                              >
                                <Plus className="h-4 w-4 mx-auto" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="ml-auto text-red-500 hover:text-red-700"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">₹{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Taxes</span>
                        <span className="font-semibold">₹{Math.round(cartTotal * 0.05)}</span>
                      </div>
                      <div className="border-t-2 border-orange-300 pt-3 flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{cartTotal + deliveryFee + Math.round(cartTotal * 0.05)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleOrder} 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 py-4 text-lg font-bold shadow-xl"
                  >
                    Place Order
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Food
