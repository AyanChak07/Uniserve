import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Transport API
export const transportAPI = {
  getVehicles: () => api.get('/transport/vehicles'),
  getNearbyVehicles: (params) => api.get('/transport/vehicles/nearby', { params }),
  createBooking: (data) => api.post('/transport/bookings', data),
  getUserBookings: () => api.get('/transport/bookings'),
  updatePayment: (id, data) => api.put(`/transport/bookings/${id}/payment`, data),
}

// Food API
export const foodAPI = {
  getRestaurants: () => api.get('/food/restaurants'),
  getNearbyRestaurants: (params) => api.get('/food/restaurants/nearby', { params }),
  getRestaurant: (id) => api.get(`/food/restaurants/${id}`),
  createOrder: (data) => api.post('/food/orders', data),
  getUserOrders: () => api.get('/food/orders'),
  updatePayment: (id, data) => api.put(`/food/orders/${id}/payment`, data),
}

// Entertainment API
export const entertainmentAPI = {
  getEvents: (params) => api.get('/entertainment/events', { params }),
  getEvent: (id) => api.get(`/entertainment/events/${id}`),
  bookTicket: (data) => api.post('/entertainment/tickets', data),
  getUserTickets: () => api.get('/entertainment/tickets'),
  updatePayment: (id, data) => api.put(`/entertainment/tickets/${id}/payment`, data),
}

export const medicalAPI = {
  getUserAppointments: () => api.get('/medical/appointments'),
  cancelAppointment: (id) => api.put(`/medical/appointments/${id}/cancel`),
  rescheduleAppointment: (id, data) => api.put(`/medical/appointments/${id}/reschedule`, data),
  getDoctorAvailability: (doctorId, date) =>
    api.get(`/medical/doctors/${doctorId}/availability`, {
      params: { date },
    }),
};

// ✅ Household (NEW)
export const householdAPI = {
  getUserBookings: () => api.get('/household/bookings'),
  cancelBooking: (id) => api.put(`/household/bookings/${id}/cancel`),
  rescheduleBooking: (id, data) =>
    api.put(`/household/bookings/${id}/reschedule`, data),
  rebookService: (id, data) =>
    api.post(`/household/bookings/${id}/rebook`, data),
}

export default api