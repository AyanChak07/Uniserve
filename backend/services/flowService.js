// ❌ DO NOT USE real Booking model here
// const Booking = require('../models/Booking')

// (Optional) If you want chat-only history, use ChatBooking
// const ChatBooking = require('../models/ChatBooking')

async function handleFlow(session, intent, entities, message, userId) {

  // 🔥 RESET FLOW IF NEW INTENT
  if (intent !== session.lastIntent) {
    session.state = null
    session.data = {}
  }

  session.lastIntent = intent

  // ================= 🚗 TRANSPORT =================
  if (intent === 'transport') {

    // ✅ AUTO-FILL CASE
    if (entities.pickup && entities.drop) {
      return `Great! I’ve got your ride details 🚗

Pickup: ${entities.pickup}
Drop: ${entities.drop}

Redirecting you to booking page...

NAVIGATE:/transport?pickup=${encodeURIComponent(entities.pickup)}&drop=${encodeURIComponent(entities.drop)}`
    }

    // STEP 1
    if (!session.state) {
      session.state = 'pickup'
      return "Where should we pick you up?"
    }

    // STEP 2
    if (session.state === 'pickup') {
      session.data.pickup = message
      session.state = 'drop'
      return "Where are you going?"
    }

    // STEP 3
    if (session.state === 'drop') {
      session.data.drop = message
      session.state = null

      return `Great! I’ve got your ride details 🚗

Pickup: ${session.data.pickup}
Drop: ${session.data.drop}

Redirecting you to booking page...

NAVIGATE:/transport?pickup=${encodeURIComponent(session.data.pickup)}&drop=${encodeURIComponent(session.data.drop)}`
    }
  }

  // ================= 🍔 FOOD =================
  if (intent === 'food') {

    if (entities.restaurant || entities.food_item) {
      return `Awesome! Let’s get your food 🍔

Redirecting you to food page...

NAVIGATE:/food`
    }

    return "What would you like to order?"
  }

  // ================= 🏥 MEDICAL =================
  if (intent === 'medical') {

    return `Got it! Let’s book your appointment 🏥

Redirecting you to medical services...

NAVIGATE:/medical`
  }

  // ================= 🏠 HOUSEHOLD =================
  if (intent === 'household') {

    return `Sure! Let’s find a service for you 🏠

Redirecting you to services...

NAVIGATE:/household`
  }

  // ================= 🎬 ENTERTAINMENT =================
  if (intent === 'entertainment') {

    return `Let’s book something fun 🎬

Redirecting you...

NAVIGATE:/entertainment`
  }

  // ================= 📜 HISTORY =================
  if (intent === 'history') {

    return `You can view your recent activity in your dashboard 📊

NAVIGATE:/profile`
  }

  return null
}

module.exports = { handleFlow }