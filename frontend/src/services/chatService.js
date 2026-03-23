import axios from 'axios'

// ✅ Base URL from .env
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 8000
})

// 🔥 CHAT API
export const sendMessage = async (payload) => {
  try {
    const res = await API.post('/chat', payload)
    return res.data
  } catch (error) {
    console.error('Chat API Error:', error?.response?.data || error.message)

    return {
      reply: "Server is busy. Try again in a moment."
    }
  }
}