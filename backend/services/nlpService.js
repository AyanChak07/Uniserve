const nlp = require('compromise')

// 🔥 INTENT DETECTION
function detectIntent(message) {
  const msg = message.toLowerCase()

  const intents = {
    transport: ['ride', 'cab', 'taxi', 'travel', 'go'],
    food: ['food', 'eat', 'order', 'pizza', 'burger'],
    medical: ['doctor', 'appointment', 'hospital'],
    household: ['plumber', 'electrician', 'repair', 'service'],
    entertainment: ['movie', 'ticket', 'event', 'concert'],
    history: ['history', 'recent', 'activity']
  }

  let bestIntent = 'chat'
  let maxScore = 0

  for (let intent in intents) {
    let score = 0

    intents[intent].forEach(word => {
      if (msg.includes(word)) score++
    })

    if (score > maxScore) {
      maxScore = score
      bestIntent = intent
    }
  }

  return bestIntent
}

// 🔥 ENTITY EXTRACTION
function extractEntities(message) {
  const text = message.toLowerCase()

  let pickup = ''
  let drop = ''

  const routeMatch = text.match(/from (.*?) to (.*)/)
  if (routeMatch) {
    pickup = routeMatch[1]
    drop = routeMatch[2]
  }

  const toMatch = text.match(/to (.*)/)
  if (!pickup && toMatch) {
    drop = toMatch[1]
  }

  let food_item = ''
  if (text.includes('pizza')) food_item = 'Pizza'
  if (text.includes('burger')) food_item = 'Burger'

  let restaurant = ''
  if (text.includes('dominos')) restaurant = 'Dominos'
  if (text.includes('kfc')) restaurant = 'KFC'

  let doctor = ''
  if (text.includes('dentist')) doctor = 'Dentist'
  if (text.includes('physician')) doctor = 'General Physician'

  let service = ''
  if (text.includes('plumber')) service = 'Plumber'
  if (text.includes('electrician')) service = 'Electrician'

  let event = ''
  if (text.includes('movie')) event = 'Movie'
  if (text.includes('concert')) event = 'Concert'

  return {
    pickup,
    drop,
    restaurant,
    food_item,
    doctor,
    service,
    event
  }
}

// 🔥 ADD THIS FUNCTION (THIS WAS MISSING)
function generateSmartReply(message) {
  const msg = message.toLowerCase()

  if (msg.includes('hi') || msg.includes('hello')) {
    return "Hey! 😊 I can help you with rides, food, doctors, and more!"
  }

  if (msg.includes('how are you')) {
    return "I'm doing great! Ready to help you 🚀"
  }

  if (msg.includes('what can you do')) {
    return "I can help you book rides 🚗, order food 🍔, book doctors 🏥 and more!"
  }

  return null
}

// ✅ FINAL EXPORT (VERY IMPORTANT)
module.exports = {
  detectIntent,
  extractEntities,
  generateSmartReply
}