import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  transportAPI,
  foodAPI,
  entertainmentAPI,
  medicalAPI,
  householdAPI,
} from '../services/api'
import { Card, CardHeader, CardContent } from '../components/ui/card'
import { User, Mail, Phone, Calendar, MapPin, Wrench } from 'lucide-react'

const truncate = (str, n) =>
  str && str.length > n ? str.substring(0, n).trim() + '…' : str

const Profile = () => {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [tickets, setTickets] = useState([])
  const [appointments, setAppointments] = useState([])
  const [household, setHousehold] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [
        bookingsRes,
        ordersRes,
        ticketsRes,
        appointmentsRes,
        householdRes,
      ] = await Promise.all([
        transportAPI.getUserBookings(),
        foodAPI.getUserOrders(),
        entertainmentAPI.getUserTickets(),
        medicalAPI.getUserAppointments(),
        householdAPI.getUserBookings(),
      ])

      setBookings(bookingsRes.data.data || [])
      setOrders(ordersRes.data.data || [])
      setTickets(ticketsRes.data.data || [])
      setAppointments(appointmentsRes.data.data || [])
      setHousehold(householdRes.data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  const statusBadge = (status, positive = true) => (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        positive
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status}
    </span>
  )

  const noDataMessage = (msg) => (
    <p className="text-center text-gray-400 italic py-6">{msg}</p>
  )

  const horizontalSlider = (items, renderItem) => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
      <div className="flex space-x-4 py-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="min-w-[280px] max-w-[320px] flex-shrink-0 p-4 border rounded-lg bg-white transition duration-300 shadow hover:shadow-xl hover:brightness-110"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12">
          My Profile
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* PROFILE INFO */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-indigo-700">
                Profile Information
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <User className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{user?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTIVITY SECTIONS */}
          <div className="lg:col-span-2 space-y-8">

            {/* TRANSPORT */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Transport Bookings ({bookings.length})
                </h2>
              </CardHeader>
              <CardContent>
                {bookings.length === 0
                  ? noDataMessage('No transport bookings yet.')
                  : horizontalSlider(bookings, (b) => (
                      <>
                        <p className="font-semibold">{b.vehicle?.model}</p>
                        <p className="text-sm text-gray-600">
                          {truncate(b.pickup?.address, 24)} →{' '}
                          {truncate(b.dropoff?.address, 24)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(b.date).toLocaleDateString()}
                        </p>
                        <div className="font-bold text-indigo-600 mt-2">
                          ₹{b.fare}
                        </div>
                        {statusBadge(b.status)}
                      </>
                    ))}
              </CardContent>
            </Card>

            {/* FOOD */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Food Orders ({orders.length})
                </h2>
              </CardHeader>
              <CardContent>
                {orders.length === 0
                  ? noDataMessage('No food orders yet.')
                  : horizontalSlider(orders, (o) => (
                      <>
                        <p className="font-semibold">
                          {o.restaurant?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {o.items.length} items
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                        <div className="font-bold text-indigo-600 mt-2">
                          ₹{o.total}
                        </div>
                        {statusBadge(o.status)}
                      </>
                    ))}
              </CardContent>
            </Card>

            {/* ENTERTAINMENT */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Entertainment Tickets ({tickets.length})
                </h2>
              </CardHeader>
              <CardContent>
                {tickets.length === 0
                  ? noDataMessage('No tickets booked yet.')
                  : horizontalSlider(tickets, (t) => (
                      <>
                        <p className="font-semibold">
                          {t.eventInfo?.title || t.event?.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t.ticketType} × {t.quantity}
                        </p>
                        <div className="font-bold text-indigo-600 mt-2">
                          ₹{t.total}
                        </div>
                        {statusBadge(t.status)}
                      </>
                    ))}
              </CardContent>
            </Card>

            {/* MEDICAL */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700">
                  Medical Appointments ({appointments.length})
                </h2>
              </CardHeader>
              <CardContent>
                {appointments.length === 0
                  ? noDataMessage('No medical appointments yet.')
                  : horizontalSlider(appointments, (a) => (
                      <>
                        <p className="font-semibold">
                          {a.doctor?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {a.doctor?.specialization}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar size={14} className="inline mr-1" />
                          {a.date} • {a.time}
                        </p>
                        <div className="font-bold text-indigo-600 mt-2">
                          ₹{a.doctor?.fee}
                        </div>
                        {statusBadge(a.status)}
                      </>
                    ))}
              </CardContent>
            </Card>

            {/* ✅ HOUSEHOLD (NEW) */}
            <Card className="shadow-lg border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
                  <Wrench size={20} />
                  Household Services ({household.length})
                </h2>
              </CardHeader>
              <CardContent>
                {household.length === 0
                  ? noDataMessage('No household services booked yet.')
                  : horizontalSlider(household, (h) => (
                      <>
                        <p className="font-semibold">{h.service?.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={14} />
                          {truncate(h.address, 28)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(h.scheduledDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {h.timeSlot}
                        </p>
                        <div className="font-bold text-indigo-600 mt-2">
                          ₹{h.price}
                        </div>
                        {statusBadge(h.status)}
                      </>
                    ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile