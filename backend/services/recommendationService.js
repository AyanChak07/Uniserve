const UserPreference = require('../models/UserPreference')

async function getRecommendation(userId) {
  const user = await UserPreference.findOne({ userId })

  if (!user) return null

  const prefs = user.preferences

  const top = Object.keys(prefs).reduce((a, b) =>
    prefs[a] > prefs[b] ? a : b
  )

  const suggestions = {
    transport: "Need a ride? I can book it for you 🚗",
    food: "Feeling hungry? Want me to order food 🍔",
    medical: "Need a doctor appointment? 🏥",
    household: "Need a plumber or electrician? 🏠",
    entertainment: "Want to book movie tickets? 🎬"
  }

  return suggestions[top]
}

module.exports = { getRecommendation }