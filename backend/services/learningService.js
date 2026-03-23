const UserPreference = require('../models/UserPreference')

async function updateUserPreference(userId, intent) {
  if (!userId || intent === 'chat') return

  let user = await UserPreference.findOne({ userId })

  if (!user) {
    user = await UserPreference.create({ userId })
  }

  user.preferences[intent] += 1
  await user.save()
}

module.exports = { updateUserPreference }