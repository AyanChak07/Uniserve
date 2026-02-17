import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Car,
  UtensilsCrossed,
  Ticket,
  Stethoscope,
  Wrench,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  transportAPI,
  foodAPI,
  entertainmentAPI,
  medicalAPI,
  householdAPI
} from '../services/api'

const motivationalQuotes = [
  'Every ride is a new journey.',
  'Good food, good mood.',
  'Make every moment entertaining.',
  'Your home deserves the best care.',
  'Little wins add up. Keep moving!'
]

// ✅ Tailwind-safe color map (ONLY ADDITION)
const statColors = {
  blue: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    bar: 'from-blue-400 to-blue-600'
  },
  orange: {
    text: 'text-orange-700',
    bg: 'bg-orange-100',
    bar: 'from-orange-400 to-orange-600'
  },
  purple: {
    text: 'text-purple-700',
    bg: 'bg-purple-100',
    bar: 'from-purple-400 to-purple-600'
  },
  green: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    bar: 'from-green-400 to-green-600'
  },
  indigo: {
    text: 'text-indigo-700',
    bg: 'bg-indigo-100',
    bar: 'from-indigo-400 to-indigo-600'
  }
}

const Dashboard = () => {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [tickets, setTickets] = useState([])
  const [appointments, setAppointments] = useState([])
  const [household, setHousehold] = useState([])
  const [loading, setLoading] = useState(true)
  const [motivational, setMotivational] = useState('')

  useEffect(() => {
    setMotivational(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    )
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [
        bookingsRes,
        ordersRes,
        ticketsRes,
        appointmentsRes,
        householdRes
      ] = await Promise.all([
        transportAPI.getUserBookings(),
        foodAPI.getUserOrders(),
        entertainmentAPI.getUserTickets(),
        medicalAPI.getUserAppointments(),
        householdAPI.getUserBookings()
      ])

      setBookings(bookingsRes.data.data || [])
      setOrders(ordersRes.data.data || [])
      setTickets(ticketsRes.data.data || [])
      setAppointments(appointmentsRes.data.data || [])
      setHousehold(householdRes.data.data || [])
    } catch {
      setBookings([])
      setOrders([])
      setTickets([])
      setAppointments([])
      setHousehold([])
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    { title: 'Book Ride', icon: Car, link: '/transport', color: 'from-blue-500 to-blue-600' },
    { title: 'Order Food', icon: UtensilsCrossed, link: '/food', color: 'from-orange-500 to-red-500' },
    { title: 'Book Tickets', icon: Ticket, link: '/entertainment', color: 'from-purple-500 to-pink-500' },
    { title: 'Doctor Visit', icon: Stethoscope, link: '/medical', color: 'from-green-500 to-emerald-600' },
    { title: 'Household Help', icon: Wrench, link: '/household', color: 'from-indigo-500 to-purple-600' }
  ]

  const getRecentActivities = () => {
    const all = [
      ...bookings.map(b => ({
        createdAt: b.createdAt,
        main: b.vehicle?.model || 'Ride',
        sub: b.pickup?.address,
        amount: b.fare,
        icon: Car
      })),
      ...orders.map(o => ({
        createdAt: o.createdAt,
        main: o.restaurant?.name || 'Food Order',
        sub: `${o.items.length} items`,
        amount: o.total,
        icon: UtensilsCrossed
      })),
      ...tickets.map(t => ({
        createdAt: t.createdAt,
        main: t.event?.title || 'Event Ticket',
        sub: `${t.quantity} tickets`,
        amount: t.total,
        icon: Ticket
      })),
      ...appointments.map(a => ({
        createdAt: a.createdAt,
        main: a.doctor?.name || 'Doctor Appointment',
        sub: a.doctor?.specialization,
        amount: a.doctor?.fee,
        icon: Stethoscope
      })),
      ...household.map(h => ({
        createdAt: h.createdAt,
        main: h.service?.name || 'Household Service',
        sub: h.address,
        amount: h.price,
        icon: Wrench
      }))
    ]

    return all
      .filter(i => i.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold mb-1">
          Welcome back, <span className="text-indigo-700">{user?.name}</span>
        </h1>
        <p className="text-gray-500 mb-10">{motivational}</p>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-5 gap-6 mb-12">
          {quickActions.map((a, i) => (
            <Link
              key={i}
              to={a.link}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${a.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <a.icon className="text-white" />
              </div>
              <h3 className="font-bold text-gray-800">{a.title}</h3>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Recent Activity</h2>
            {getRecentActivities().length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              <ul className="space-y-4">
                {getRecentActivities().map((a, i) => (
                  <li key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100">
                      <a.icon className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{a.main}</div>
                      <div className="text-xs text-gray-500">{a.sub}</div>
                    </div>
                    <div className="font-bold text-indigo-600">₹{a.amount}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
              <TrendingUp /> My Stats
            </h2>

            <Stat label="Rides" value={bookings.length} color="blue" />
            <Stat label="Food Orders" value={orders.length} color="orange" />
            <Stat label="Tickets" value={tickets.length} color="purple" />
            <Stat label="Medical" value={appointments.length} color="green" />
            <Stat label="Household" value={household.length} color="indigo" />
          </div>
        </div>

        {/* Motivation */}
        <div className="mt-10 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl p-6 text-center shadow">
          <Sparkles className="mx-auto mb-2 text-indigo-500" />
          <p className="text-xl font-bold text-indigo-700">{motivational}</p>
        </div>
      </div>
    </div>
  )
}

// ✅ ONLY Stat component changed (logic-safe)
const Stat = ({ label, value, color }) => {
  const c = statColors[color]

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className={`${c.text} font-medium`}>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className={`h-2 ${c.bg} rounded-full`}>
        <div
          className={`h-2 bg-gradient-to-r ${c.bar} rounded-full`}
          style={{ width: `${Math.min(value * 12, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default Dashboard