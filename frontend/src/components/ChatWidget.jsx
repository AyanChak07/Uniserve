import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ChatWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      { role: 'assistant', text: user
        ? `Hi ${user.name.split(' ')[0]}! I'm Zoey your personal assistant. How can I help you today?`
        : `Hi! I'm Zoey your personal assistant. How can I help you today?`
      }
    ])
  }, [user])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowGreeting(true), 2000)
      return () => clearTimeout(timer)
    } else {
      setShowGreeting(false)
    }
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
// for page switch
  useEffect(() => {
  const lastMsg = messages[messages.length - 1]

  if (!lastMsg || lastMsg.role !== 'assistant') return

  const match = lastMsg.text.match(/NAVIGATE:(\S+)/)

  if (match) {
    const route = match[1]

    // safety check
    if (routeLabels[route]) {
      setTimeout(() => {
        navigate(route)
      }, 1200)
    }
  }
}, [messages])

  const handleOpen = () => {
    setOpen(o => !o)
    setShowGreeting(false)
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:5000/api/chat', { message: input })
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  const routeLabels = {
    '/entertainment': 'Go to Entertainment',
    '/food': 'Go to Food',
    '/transport': 'Go to Transport',
    '/medical': 'Go to Medical',
    '/household': 'Go to Household Services',
    '/dashboard': 'Go to Dashboard',
    '/medical/appointments': 'Go to My Appointments',     
    '/household/bookings': 'Go to My Bookings', 
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {/* Greeting popup — only when not logged in */}
      {showGreeting && !open && (
        <div className="mb-3 bg-white border border-gray-200 shadow-xl rounded-2xl rounded-br-none px-4 py-3 max-w-[220px]">
          <p className="text-sm text-gray-700 font-semibold">👋 Hi! I'm Zoey.</p>
          <p className="text-xs text-gray-500 mt-1">Here to help you navigate the platform!</p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleOpen}
              className="text-xs text-indigo-600 font-medium hover:text-indigo-800"
            >
              Chat with me
            </button>
            <button
              onClick={() => setShowGreeting(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Zoey</span>
            <button onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-80 bg-gray-50">
            {messages.map((m, i) => {
              const navMatch = m.text.match(/NAVIGATE:(\S+)/)
              const cleanText = m.text.replace(/NAVIGATE:\S+/g, '').trim()
              return (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}>
                    {cleanText}
                  </div>
                  {navMatch && (
                    <button
                      onClick={() => {
                        navigate(navMatch[1])
                        
                      }}
                      className="mt-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition"
                    >
                      {routeLabels[navMatch[1]] || 'Go there'}
                    </button>
                  )}
                </div>
              )
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-none">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-lg transition"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={handleOpen}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}