const {
  detectIntent,
  extractEntities,
  generateSmartReply
} = require('../services/nlpService')

const { handleFlow } = require('../services/flowService')
const { updateUserPreference } = require('../services/learningService')
const { getRecommendation } = require('../services/recommendationService')

const ChatHistory = require('../models/ChatHistory')

const sessions = new Map()

function getSession(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {
      memory: {},
      activeIntent: null,
      state: null,
      data: {}
    })
  }
  return sessions.get(id)
}

const chatHandler = async (req, res) => {
  const { message, sessionId, userId } = req.body

  try {
    const session = getSession(sessionId)
    const msg = message.toLowerCase().trim()

    // 🔥 RESET COMMAND (VERY IMPORTANT)
    if (msg === 'cancel' || msg === 'reset') {
      session.activeIntent = null
      session.state = null
      session.data = {}
      session.memory = {}

      return res.json({
        reply: "Okay 👍 I’ve reset everything. What would you like to do?"
      })
    }

    // 🧠 STEP 1: Detect intent
    const detectedIntent = detectIntent(message)

    // 🔥 STEP 2: INTENT LOCKING (FIXED LOGIC)
    if (!session.activeIntent) {
      session.activeIntent = detectedIntent
    }

    // Only update intent if NOT inside a flow
    if (!session.state && detectedIntent !== 'chat') {
      session.activeIntent = detectedIntent
    }

    const intent = session.activeIntent

    // 🧠 STEP 3: Extract entities
    const entities = extractEntities(message)

    // 🧠 STEP 4: Merge memory
    session.memory = {
      ...session.memory,
      ...entities
    }

    // 🧠 STEP 5: Save chat history (safe)
    try {
      await ChatHistory.create({
        userId,
        message,
        intent
      })
    } catch (err) {
      console.warn("ChatHistory save failed:", err.message)
    }

    // 🧠 STEP 6: Learning (safe)
    try {
      await updateUserPreference(userId, intent)
    } catch (err) {
      console.warn("Learning failed:", err.message)
    }

    // 🔥 STEP 7: HANDLE FLOW
    const flow = await handleFlow(
      session,
      intent,
      session.memory,
      message,
      userId
    )

    if (flow) return res.json({ reply: flow })

    // 🤖 STEP 8: Smart reply
    const smart = generateSmartReply(message)
    if (smart) {
      // Reset intent if casual chat
      session.activeIntent = null
      return res.json({ reply: smart })
    }

    // 🔥 STEP 9: Recommendation
    try {
      const recommendation = await getRecommendation(userId)
      if (recommendation) {
        return res.json({ reply: recommendation })
      }
    } catch (err) {
      console.warn("Recommendation failed:", err.message)
    }

    // 🔥 FINAL FALLBACK
    return res.json({
      reply: "I can help you book rides, food, or services 😊"
    })

  } catch (err) {
    console.error("CHAT ERROR:", err)
    res.json({ reply: "Something went wrong." })
  }
}

module.exports = { chatHandler }