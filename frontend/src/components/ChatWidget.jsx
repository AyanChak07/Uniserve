import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { sendMessage } from '../services/chatService'

function ChatWidget() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const bottomRef = useRef(null)

  const [sessionId] = useState(() => {
    let id = localStorage.getItem('chat_session')
    if (!id) {
      id = Date.now().toString()
      localStorage.setItem('chat_session', id)
    }
    return id
  })

  // INITIAL MESSAGE
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: user
          ? `Hi ${user.name.split(' ')[0]}! I'm Zoey. What can I do for you?`
          : `Hi! I'm Zoey. What can I do for you?`
      }
    ])
  }, [user])

  // NETWORK STATUS
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  // GREETING POPUP
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowGreeting(true), 1500)

      // auto hide after 6 sec
      const hideTimer = setTimeout(() => setShowGreeting(false), 7000)

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    } else {
      setShowGreeting(false)
    }
  }, [user])

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleOpen = () => {
    setOpen(o => !o)
    setShowGreeting(false)
  }

  // SUGGESTIONS
  const getSuggestions = () => {
    const last = messages[messages.length - 1]?.text?.toLowerCase() || ''

    if (last.includes('confirm')) return ['YES', 'NO']
    if (last.includes('pickup')) return ['Home', 'Office']
    if (last.includes('restaurant')) return ['Dominos', 'KFC']
    if (last.includes('doctor')) return ['Dentist', 'General']
    if (last.includes('service')) return ['Plumber', 'Electrician']

    return [
      'Book a ride',
      'Order food',
      'Doctor appointment',
      'Household service',
      'Book tickets',
      'Show history'
    ]
  }

  // SEND MESSAGE
  const send = async (msgOverride) => {
    const text = msgOverride || input
    if (!text.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const data = await sendMessage({
        message: text,
        sessionId,
        userId: user?._id || 'guest'
      })

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.reply }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "⚠️ Unable to connect. Please try again."
        }
      ])
    }

    setLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {/* GREETING */}
      {showGreeting && !open && (
        <div className="mb-3 max-w-xs bg-white shadow-2xl rounded-2xl px-4 py-3 animate-fade-in">

          <p className="text-sm font-semibold text-gray-800">
            Hi {user ? user.name.split(' ')[0] : 'there'} 👋
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Use me to easily book rides, food & services 🚀
          </p>

          <button
            onClick={handleOpen}
            className="text-xs text-indigo-600 mt-2 font-medium"
          >
            Start chatting →
          </button>

        </div>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="mb-4 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">Zoey Assistant</p>
              <p className="text-xs text-indigo-200">
                {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* MESSAGES (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">

            {messages.map((m, i) => {
              const navMatch = m.text.match(/NAVIGATE:(\S+)/)
              const cleanText = m.text.replace(/NAVIGATE:\S+/g, '').trim()

              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs mr-2">
                      Z
                    </div>
                  )}

                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow ${m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border'
                    }`}>
                    {cleanText}
                  </div>

                  {navMatch && (
                    <button
                      onClick={() => navigate(navMatch[1])}
                      className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded"
                    >
                      Go
                    </button>
                  )}
                </div>
              )
            })}

            {loading && (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS + BACK BUTTON */}
          {!loading && (
            <div className="px-3 py-2 flex flex-wrap gap-2 bg-gray-50 border-t">

              <button
                onClick={() => send('reset')}
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
              >
                ⬅ Back
              </button>

              {getSuggestions().map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q)}
                  className="text-xs bg-white border px-2 py-1 rounded hover:bg-indigo-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={() => send()}
              className="bg-indigo-600 text-white p-2 rounded-lg"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={handleOpen}
        className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}

export default ChatWidget