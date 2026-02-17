import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/ui/navbar'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './pages/Dashboard'
import Transport from './pages/Transport'
import Food from './pages/Food'
import Entertainment from './pages/Entertainment'
import Profile from './pages/Profile'
import About from './pages/About'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Medical from './pages/Medical'
import MyAppointments from './pages/MyAppointments'
import HouseholdHome from "./pages/HouseholdHome";
import HouseholdCategories from "./pages/HouseholdCategories";
import HouseholdServices from "./pages/HouseholdServices";
import HouseholdMap from "./pages/HouseholdMap";
import HouseholdDetails from "./pages/HouseholdDetails";
import MyHouseholdBookings from "./pages/MyHouseholdBookings";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/medical/appointments" element={<MyAppointments />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/transport" element={
              <ProtectedRoute>
                <Transport />
              </ProtectedRoute>
            } />

            <Route path="/food" element={
              <ProtectedRoute>
                <Food />
              </ProtectedRoute>
            } />

            <Route path="/entertainment" element={
              <ProtectedRoute>
                <Entertainment />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* 
            ===============================
            HOUSEHOLD ROUTES
            =============================== */}
            <Route path="/household" element={<HouseholdHome />} />

            <Route path="/household/categories" element={<HouseholdCategories />} />

            <Route path="/household/services" element={<HouseholdServices />} />

            <Route path="/household/map" element={<HouseholdMap />} />

            <Route path="/household/:id" element={<HouseholdDetails />} />

            <Route
              path="/household/bookings"
              element={
                <ProtectedRoute>
                  <MyHouseholdBookings />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App