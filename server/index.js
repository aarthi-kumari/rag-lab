const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

const messagesPath = path.join(__dirname, "data", "messages.json")

function readMessages() {
  if (!fs.existsSync(messagesPath)) return []
  const raw = fs.readFileSync(messagesPath, "utf8")
  if (!raw) return []
  return JSON.parse(raw)
}

function writeMessages(messages) {
  fs.mkdirSync(path.dirname(messagesPath), { recursive: true })
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2))
}

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.get("/chats/:chatId/messages", (req, res) => {
    const messages = readMessages().filter(
      (message) => message.chatId === req.params.chatId
    )
    res.json(messages)
  })
  
  app.post("/chats/:chatId/messages", (req, res) => {
    const text = typeof req.body.text === "string" ? req.body.text.trim() : ""
    if (!text) {
      return res.status(400).json({ error: "Text is required." })
    }
  
    const message = {
      id: crypto.randomUUID(),
      chatId: req.params.chatId,
      text,
      createdAt: new Date().toISOString(),
    }
    const messages = readMessages()
    messages.push(message)
    writeMessages(messages)
    res.status(201).json(message)
  })
  
app.listen(4000, () => {
  console.log("Express listening on http://localhost:4000")
})