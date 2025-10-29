import { useState } from 'react'
import { X } from 'lucide-react'
import Button from './ui/button'

const SeatSelection = ({ event, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTicketType, setSelectedTicketType] = useState(null)

  // Generate seat layout (8 rows x 10 seats)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const seatsPerRow = 10

  // Randomly mark some seats as occupied for demo
  const occupiedSeats = ['A3', 'A7', 'B4', 'B5', 'C2', 'C8', 'D1', 'D9', 'E5', 'F3', 'F6', 'G2', 'G7', 'H4', 'H8']

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return

    if (!selectedTicketType) {
      alert('Please select a ticket type first')
      return
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId))
    } else {
      setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const getSeatStatus = (seatId) => {
    if (occupiedSeats.includes(seatId)) return 'occupied'
    if (selectedSeats.includes(seatId)) return 'selected'
    return 'available'
  }

  const getSeatColor = (seatId) => {
    const status = getSeatStatus(seatId)
    if (status === 'occupied') return 'bg-red-400 cursor-not-allowed'
    if (status === 'selected') return 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
    return 'bg-gray-200 cursor-pointer hover:bg-gray-300'
  }

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }
    if (!selectedTicketType) {
      alert('Please select a ticket type')
      return
    }

    onConfirm({
      seats: selectedSeats,
      ticketType: selectedTicketType,
      quantity: selectedSeats.length
    })
  }

  const totalPrice = selectedSeats.length * (selectedTicketType?.price || 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold mb-1">Select Seats</h2>
            <p className="text-purple-100">{event.title}</p>
          </div>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Ticket Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">1. Select Ticket Type</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.ticketTypes.map((type) => (
                <button
                  key={type.type}
                  onClick={() => setSelectedTicketType(type)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedTicketType?.type === type.type
                      ? 'border-purple-600 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900">{type.type}</h4>
                    <span className="text-xl font-bold text-purple-600">₹{type.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.available} available</p>
                </button>
              ))}
            </div>
          </div>

          {/* Screen */}
          <div className="mb-8">
            <div className="bg-gradient-to-b from-gray-300 to-gray-200 rounded-t-xl py-3 text-center text-gray-600 font-semibold border-2 border-gray-300 border-b-0">
              SCREEN
            </div>
          </div>

          {/* Seat Layout */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">2. Choose Your Seats</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              {rows.map((row) => (
                <div key={row} className="flex justify-center items-center gap-2 mb-3">
                  <div className="w-8 text-center font-bold text-gray-700">{row}</div>
                  {[...Array(seatsPerRow)].map((_, index) => {
                    const seatNumber = index + 1
                    const seatId = `${row}${seatNumber}`
                    return (
                      <button
                        key={seatId}
                        onClick={() => toggleSeat(seatId)}
                        disabled={occupiedSeats.includes(seatId)}
                        className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${getSeatColor(seatId)}`}
                        title={seatId}
                      >
                        {seatNumber}
                      </button>
                    )
                  })}
                  <div className="w-8 text-center font-bold text-gray-700">{row}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
          </div>

          {/* Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Seats:</p>
                  <p className="font-bold text-purple-900">{selectedSeats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ticket Type:</p>
                  <p className="font-bold text-purple-900">{selectedTicketType?.type}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-purple-200">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-purple-600">₹{totalPrice}</p>
                </div>
                <p className="text-gray-600">{selectedSeats.length} ticket(s)</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0 || !selectedTicketType}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book {selectedSeats.length} Ticket(s)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
