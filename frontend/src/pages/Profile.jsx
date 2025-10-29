import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { transportAPI, foodAPI, entertainmentAPI } from '../services/api'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { User, Mail, Phone, Calendar } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [bookingsRes, ordersRes, ticketsRes] = await Promise.all([
        transportAPI.getUserBookings(),
        foodAPI.getUserOrders(),
        entertainmentAPI.getUserTickets(),
      ])
      setBookings(bookingsRes.data.data)
      setOrders(ordersRes.data.data)
      setTickets(ticketsRes.data.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Profile Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Transport Bookings ({bookings.length})</h2>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{booking.vehicle?.model}</p>
                            <p className="text-sm text-gray-600">{booking.pickup.address} → {booking.dropoff.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-600">₹{booking.fare}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Food Orders ({orders.length})</h2>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map(order => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{order.restaurant?.name}</p>
                            <p className="text-sm text-gray-600">{order.items.length} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-600">₹{order.total}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Entertainment Tickets ({tickets.length})</h2>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No tickets yet</p>
                ) : (
                  <div className="space-y-3">
                    {tickets.slice(0, 3).map(ticket => (
                      <div key={ticket._id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold">{ticket.event?.title}</p>
                            <p className="text-sm text-gray-600">{ticket.ticketType} × {ticket.quantity}</p>
                            <p className="text-xs text-gray-500">ID: {ticket.bookingId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-600">₹{ticket.total}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
