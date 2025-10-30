import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, UtensilsCrossed, Ticket, User, Sparkles, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { transportAPI, foodAPI, entertainmentAPI } from '../services/api';

const motivationalQuotes = [
  "Every ride is a new journey.",
  "Good food, good mood.",
  "Make every moment entertaining.",
  "Go places. Try new tastes. Experience more.",
  "You’re one step away from a new adventure.",
  "Little wins add up. Keep moving!"
];

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motivational, setMotivational] = useState('');

  useEffect(() => {
    setMotivational(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsRes, ordersRes, ticketsRes] = await Promise.all([
        transportAPI.getUserBookings(),
        foodAPI.getUserOrders(),
        entertainmentAPI.getUserTickets(),
      ]);
      setBookings(bookingsRes.data.data || []);
      setOrders(ordersRes.data.data || []);
      setTickets(ticketsRes.data.data || []);
    } catch (error) {
      setBookings([]); setOrders([]); setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Book a Ride', icon: Car, link: '/transport', color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-200' },
    { title: 'Order Food', icon: UtensilsCrossed, link: '/food', color: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-200' },
    { title: 'Book Tickets', icon: Ticket, link: '/entertainment', color: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-200' },
    { title: 'My Profile', icon: User, link: '/profile', color: 'from-green-400 to-green-600', shadow: 'shadow-green-200' },
  ];

  const getRecentActivities = () => {
    const all = [
      ...bookings.map((item) => ({
        type: 'ride',
        createdAt: item.date || item.createdAt,
        main: item.vehicle?.model || 'Ride',
        sub: (item.pickup?.address ? `From ${item.pickup.address}` : '') +
          (item.dropoff?.address ? ` → ${item.dropoff.address}` : ''),
        amount: item.fare,
        status: item.status,
        _id: item._id,
      })),
      ...orders.map((item) => ({
        type: 'food',
        createdAt: item.createdAt,
        main: item.restaurant?.name || 'Food Order',
        sub: `${item.items.length} ${item.items.length === 1 ? 'item' : 'items'}`,
        amount: item.total,
        status: item.status,
        _id: item._id,
      })),
      ...tickets.map((item) => ({
        type: 'ticket',
        createdAt: item.createdAt,
        main: item.eventInfo?.title || item.event?.title || 'Event Ticket',
        sub: `${item.ticketType} × ${item.quantity}`,
        amount: item.total,
        status: item.status,
        _id: item._id,
      })),
    ].filter(item => item.createdAt);

    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-10 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight animate-fade-in">
              Welcome back, <span className="text-indigo-700">{user?.name || 'User'}</span>!
            </h1>
            <p className="text-lg text-gray-500 mt-3 font-medium">What would you like to do today?</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 ring-2 ring-indigo-400 bg-gradient-to-br from-indigo-300 via-blue-200 to-indigo-400 rounded-full flex items-center justify-center text-3xl font-semibold shadow-md ml-4 select-none">
              {user?.name?.[0] || 'U'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-8 mb-14">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className={`group bg-white/90 rounded-2xl border border-gray-200 hover:border-transparent shadow-md ${action.shadow} p-8 flex flex-col items-center cursor-pointer transition-all transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl`}
              style={{ minHeight: 180 }}
            >
              <div
                className={`bg-gradient-to-br ${action.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md group-hover:brightness-110 group-hover:scale-110 transition`}
              >
                <action.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-indigo-700 mb-1 text-center">
                {action.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Middle Panels */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/90 rounded-2xl border border-gray-200 shadow-lg p-8 flex flex-col justify-center min-h-[180px]">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Recent Activity</h2>
            {getRecentActivities().length === 0 ? (
              <div className="flex items-center gap-4 text-gray-500 font-medium">
                <span className="text-lg">No recent activity yet. Start booking services!</span>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {getRecentActivities().map((activity, idx) => (
                  <li
                    key={activity._id || idx}
                    className="flex items-center bg-gray-50 rounded-lg px-4 py-2 shadow group transition-all hover:bg-indigo-50"
                  >
                    <span
                      className={`flex-none w-10 h-10 mr-3 rounded-lg flex items-center justify-center
                        ${activity.type === 'ride' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'food' ? 'bg-orange-100 text-orange-600' :
                          'bg-purple-100 text-purple-600'
                        } text-lg font-bold`}
                    >
                      {activity.type === 'ride' && <Car className="w-6 h-6" />}
                      {activity.type === 'food' && <UtensilsCrossed className="w-6 h-6" />}
                      {activity.type === 'ticket' && <Ticket className="w-6 h-6" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate">{activity.main}</div>
                      <div className="text-xs text-gray-500 truncate">{activity.sub}</div>
                    </div>
                    <div className="ml-3 text-right">
                      <div className="font-bold text-indigo-700">₹{activity.amount?.toLocaleString?.() || '-'}</div>
                      <div className="text-xs text-gray-500">
                        {activity.createdAt && !isNaN(new Date(activity.createdAt))
                          ? new Date(activity.createdAt).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* MOTIVATIONAL + STATS WIDGET */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-violet-100 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center min-h-[80px] border border-purple-100 relative">
              <div className="absolute left-4 top-3 text-indigo-400"><Sparkles className="w-7 h-7" /></div>
              <p className="text-xl font-bold text-indigo-700 mb-2 text-center leading-tight">{motivational}</p>
              <span className="text-sm text-gray-400 text-center">Stay inspired!</span>
            </div>
            <div className="flex-1 bg-white/90 rounded-2xl border border-gray-200 shadow p-6 flex flex-col justify-evenly">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-7 w-7 text-indigo-500 mr-2" />
                <span className="text-lg font-bold text-indigo-700">My Stats</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span className="text-blue-700">Rides</span>
                    <span className="text-gray-600 font-semibold">{bookings.length}</span>
                  </div>
                  <div className="h-2 bg-blue-100 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{width: `${Math.min(bookings.length * 12, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span className="text-orange-700">Food Orders</span>
                    <span className="text-gray-600 font-semibold">{orders.length}</span>
                  </div>
                  <div className="h-2 bg-orange-100 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{width: `${Math.min(orders.length * 12, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm font-medium">
                    <span className="text-purple-700">Tickets</span>
                    <span className="text-gray-600 font-semibold">{tickets.length}</span>
                  </div>
                  <div className="h-2 bg-purple-100 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{width: `${Math.min(tickets.length * 12, 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;