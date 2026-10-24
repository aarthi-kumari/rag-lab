const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const { ruleReply } = require("./rules")

const app = express()
const multer = require("multer")

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

const uploadsDir = path.join(__dirname, "uploads")
const filesPath = path.join(__dirname, "data", "files.json")
fs.mkdirSync(uploadsDir, { recursive: true })

const upload = multer({ dest: uploadsDir })

function readFiles() {
  if (!fs.existsSync(filesPath)) return []
  const raw = fs.readFileSync(filesPath, "utf8")
  if (!raw) return []
  return JSON.parse(raw)
}

function writeFiles(files) {
  fs.mkdirSync(path.dirname(filesPath), { recursive: true })
  fs.writeFileSync(filesPath, JSON.stringify(files, null, 2))
}

app.get("/health", (req, res) => {
  res.json({ ok: true })
})

app.get("/chats", (req, res) => {
  const messages = readMessages()
  const chats = []
  const index = new Map()

  for (const message of messages) {
    let chat = index.get(message.chatId)
    if (!chat) {
      chat = {
        id: message.chatId,
        createdAt: message.createdAt,
        title: "",
      }
      index.set(message.chatId, chat)
      chats.push(chat)
    }
    if (message.createdAt > chat.createdAt) {
      chat.createdAt = message.createdAt
    }
    const role = message.role === "assistant" ? "assistant" : "user"
    if (role === "user" && !chat.title) {
      chat.title = message.text
    }
  }

  for (const file of readFiles()) {
    if (index.has(file.chatId)) continue
    const chat = {
      id: file.chatId,
      createdAt:
        typeof file.createdAt === "string"
          ? file.createdAt
          : new Date().toISOString(),
      title: file.originalName,
    }
    index.set(file.chatId, chat)
    chats.push(chat)
  }

  chats.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  res.json(chats)
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
  
    const role = req.body.role === "assistant" ? "assistant" : "user"
    const message = {
      id: crypto.randomUUID(),
      chatId: req.params.chatId,
      text,
      role,
      createdAt: new Date().toISOString(),
    }
    const messages = readMessages()
    messages.push(message)
    if (role === "user") {
      const files = readFiles().filter((file) => file.chatId === req.params.chatId)
      messages.push({
        id: crypto.randomUUID(),
        chatId: req.params.chatId,
        text: ruleReply(text, files),
        role: "assistant",
        createdAt: new Date().toISOString(),
      })
    }
    writeMessages(messages)
    res.status(201).json(message)
  })

  app.get("/chats/:chatId/files", (req, res) => {
    const files = readFiles().filter((file) => file.chatId === req.params.chatId)
    res.json(files)
  })
  
  app.post("/chats/:chatId/files", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "File is required." })
    }
  
    const record = {
      id: crypto.randomUUID(),
      chatId: req.params.chatId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      createdAt: new Date().toISOString(),
    }
    const files = readFiles()
    files.push(record)
    writeFiles(files)
    res.status(201).json(record)
  })
  
  app.get("/uploads/:storedName", (req, res) => {
    const storedName = path.basename(req.params.storedName)
    const filePath = path.join(uploadsDir, storedName)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." })
    }
    res.sendFile(filePath)
  })
  
app.listen(4000, () => {
  console.log("Express listening on http://localhost:4000")
})