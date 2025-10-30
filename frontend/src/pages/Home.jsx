import { Link } from 'react-router-dom'
import { Car, UtensilsCrossed, Ticket, ArrowRight, Clock, Shield, Star, Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Home = () => {
  const services = [
    {
      icon: Car,
      title: 'Transport',
      description: 'Book bikes, cars, and SUVs for your travel needs with real-time tracking',
      gradient: 'from-blue-500 to-blue-600',
      link: '/transport',
    },
    {
      icon: UtensilsCrossed,
      title: 'Food Delivery',
      description: 'Order from nearby restaurants and get food delivered to your doorstep',
      gradient: 'from-orange-500 to-red-500',
      link: '/food',
    },
    {
      icon: Ticket,
      title: 'Entertainment',
      description: 'Book tickets for movies, concerts, sports events, and comedy shows',
      gradient: 'from-purple-500 to-pink-500',
      link: '/entertainment',
    },
  ]

  const features = [
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Available anytime, anywhere',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and encrypted transactions',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: '4.8/5 customer satisfaction',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      icon: Zap,
      title: 'Fast Booking',
      description: 'Book services in seconds',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              All Your Services,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Unified & Simplified
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Experience the future of service booking with uniServe. From rides to restaurants, 
              movies to medical care, household help to shopping - everything you need, when you need it.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border-2 border-white bg-white bg-opacity-10 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-20 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Six Essential Services,{' '}
              <span className="gradient-text">One Platform</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              uniServe brings together the most essential daily services into one seamless 
              experience. Save time, save money, and simplify your life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to={service.link}
                className="group bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${service.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="h-10 w-10 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Explore Now 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Additional Services Coming Soon */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-md p-8 border-2 border-dashed border-green-200">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🏥</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Medical</h3>
              <p className="text-gray-600 mb-4">Book appointments with doctors</p>
              <span className="badge bg-green-100 text-green-700">Coming Soon</span>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-md p-8 border-2 border-dashed border-yellow-200">
              <div className="bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Household Help</h3>
              <p className="text-gray-600 mb-4">Professional cleaning services</p>
              <span className="badge bg-yellow-100 text-yellow-700">Coming Soon</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-md p-8 border-2 border-dashed border-blue-200">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🛍️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Shopping</h3>
              <p className="text-gray-600 mb-4">Doorstep delivery of essentials</p>
              <span className="badge bg-blue-100 text-blue-700">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">uniServe?</span>
            </h2>
            <p className="text-gray-600 text-lg">
              We're not just another app - we're your daily life companion, designed to make every 
              service booking effortless and reliable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center group">
                <div className={`${feature.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-10 w-10 ${feature.color}`} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-10 leading-relaxed">
            Join millions of satisfied customers who trust uniServe for their daily service 
            needs. Experience the difference of truly unified service booking.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
          >
            Sign Up Now - It's Free
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                uniServe
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your one-stop platform for all daily service needs. Simplifying life, one service at a time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Services</h4>
              <ul className="space-y-3">
                <li><Link to="/transport" className="text-gray-400 hover:text-white transition-colors">Transport</Link></li>
                <li><Link to="/food" className="text-gray-400 hover:text-white transition-colors">Food Delivery</Link></li>
                <li><Link to="/entertainment" className="text-gray-400 hover:text-white transition-colors">Entertainment</Link></li>
                <li><span className="text-gray-500">Medical (Coming Soon)</span></li>
                <li><span className="text-gray-500">Household (Coming Soon)</span></li>
                <li><span className="text-gray-500">Shopping (Coming Soon)</span></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400">Email</p>
                    <a href="mailto:uniserve.mailer@gmail.com" className="text-white hover:text-blue-400 transition-colors break-all">
                      uniserve.mailer@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <a href="tel:+917003888896" className="text-white hover:text-green-400 transition-colors">
                      +91 7003888896
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400">Address</p>
                    <p className="text-white">
                      KP - 6, School of Computer Engineering,<br />
                      KIIT University
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 uniServe. All rights reserved. Made with ❤️ for simplifying your life.
              </p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
