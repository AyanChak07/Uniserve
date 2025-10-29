import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Car, UtensilsCrossed, Ticket, User } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()

  const quickActions = [
    { title: 'Book a Ride', icon: Car, link: '/transport', color: 'bg-blue-500' },
    { title: 'Order Food', icon: UtensilsCrossed, link: '/food', color: 'bg-orange-500' },
    { title: 'Book Tickets', icon: Ticket, link: '/entertainment', color: 'bg-purple-500' },
    { title: 'My Profile', icon: User, link: '/profile', color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">What would you like to do today?</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">No recent activity yet. Start booking services!</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Special Offers</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-primary-600 pl-4">
                <p className="font-medium">50% off on first ride!</p>
                <p className="text-sm text-gray-600">Use code: FIRST50</p>
              </div>
              <div className="border-l-4 border-orange-600 pl-4">
                <p className="font-medium">Free delivery on orders above ₹500</p>
                <p className="text-sm text-gray-600">Valid till this weekend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
