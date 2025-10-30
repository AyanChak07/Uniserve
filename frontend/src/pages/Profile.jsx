import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transportAPI, foodAPI, entertainmentAPI } from '../services/api';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { User, Mail, Phone, Calendar } from 'lucide-react';

const truncate = (str, n) =>
  str && str.length > n ? str.substring(0, n).trim() + '…' : str;

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, ordersRes, ticketsRes] = await Promise.all([
        transportAPI.getUserBookings(),
        foodAPI.getUserOrders(),
        entertainmentAPI.getUserTickets(),
      ]);
      setBookings(bookingsRes.data.data);
      setOrders(ordersRes.data.data);
      setTickets(ticketsRes.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const statusBadge = (status, positive = true) => (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        positive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status}
    </span>
  );

  const noDataMessage = (msg) => <p className="text-center text-gray-400 italic py-6">{msg}</p>;

  const horizontalSlider = (items, renderItem) => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
      <div className="flex space-x-4 py-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="min-w-[280px] max-w-[320px] flex-shrink-0 p-4 border rounded-lg bg-white transition duration-300 shadow hover:shadow-xl hover:brightness-110"
            style={{ wordBreak: "break-word" }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 tracking-tight">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Profile Information Card */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-indigo-700">Profile Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-center space-x-4">
                  <User className="h-6 w-6 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-lg font-semibold">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg font-semibold">{user?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings, Orders and Tickets sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Transport Bookings */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Transport Bookings ({bookings.length})
                </h2>
              </CardHeader>
              <CardContent>
                {bookings.length === 0
                  ? noDataMessage('No transport bookings yet.')
                  : horizontalSlider(bookings, (booking) => (
                      <div>
                        <p className="font-semibold text-indigo-800">{booking.vehicle?.model || 'Unknown vehicle'}</p>
                        <p
                          className="text-sm text-gray-600"
                          title={
                            (booking.pickup.address || '') +
                            ' → ' +
                            (booking.dropoff.address || '')
                          }
                        >
                          {truncate(booking.pickup.address, 26)}
                          {' → '}
                          {truncate(booking.dropoff.address, 26)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar className="inline mb-0.5 mr-1" size={16} />
                          {booking.date && !isNaN(new Date(booking.date)) ? new Date(booking.date).toLocaleDateString() : 'Date N/A'}
                        </p>
                        <div className="mt-2 font-bold text-indigo-600 text-lg">
                          ₹{booking.fare?.toLocaleString()}
                        </div>
                        <div>{statusBadge(booking.status === 'completed' ? 'Completed' : booking.status, booking.status === 'completed')}</div>
                      </div>
                    ))}
              </CardContent>
            </Card>

            {/* Food Orders */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">Food Orders ({orders.length})</h2>
              </CardHeader>
              <CardContent>
                {orders.length === 0
                  ? noDataMessage('No food orders yet.')
                  : horizontalSlider(orders, (order) => (
                      <div>
                        <p className="font-semibold text-indigo-800">{order.restaurant?.name}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar className="inline mb-0.5 mr-1" size={16} />
                          {order.createdAt && !isNaN(new Date(order.createdAt)) ? new Date(order.createdAt).toLocaleDateString() : 'Date N/A'}
                        </p>
                        <div className="mt-2 font-bold text-indigo-600 text-lg">
                          ₹{order.total?.toLocaleString()}
                        </div>
                        <div>{statusBadge(order.status === 'delivered' ? 'Delivered' : order.status, order.status === 'delivered')}</div>
                      </div>
                    ))}
              </CardContent>
            </Card>

            {/* Entertainment Tickets */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Entertainment Tickets ({tickets.length})
                </h2>
              </CardHeader>
              <CardContent>
                {tickets.length === 0
                  ? noDataMessage('No tickets booked yet.')
                  : horizontalSlider(tickets, (ticket) => (
                      <div>
                        <p className="font-semibold text-indigo-800">
                          {ticket.eventInfo?.title || ticket.event?.title || 'Unknown event'}
                        </p>
                        <p className="text-sm text-gray-700">
                          {ticket.ticketType} × {ticket.quantity}
                        </p>
                        <p className="text-xs text-gray-500">ID: {ticket.bookingId}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar className="inline mb-0.5 mr-1" size={14} />
                          {ticket.createdAt && !isNaN(new Date(ticket.createdAt)) ? new Date(ticket.createdAt).toLocaleDateString() : 'Date N/A'}
                        </p>
                        <div className="mt-2 font-bold text-indigo-600 text-lg">₹{ticket.total?.toLocaleString()}</div>
                        <div>{statusBadge(ticket.status === 'active' ? 'Active' : ticket.status, ticket.status === 'active')}</div>
                      </div>
                    ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;