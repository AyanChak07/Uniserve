import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import Button from '../ui/button'

const OTPVerification = ({ userId, email, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('')
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')

    if (otpValue.length !== 6) {
      setError('Please enter complete OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otpValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      setSuccess('Email verified successfully!')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      login(data.user, data.token)

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP')
      }

      setSuccess('OTP resent successfully!')
      setTimer(60)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Register
        </button>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a 6-digit OTP to
            <br />
            <span className="font-semibold text-primary-600">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 mx-auto disabled:opacity-50 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-600 text-sm">
              Resend OTP in <span className="font-semibold text-primary-600">{timer}s</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTPVerification