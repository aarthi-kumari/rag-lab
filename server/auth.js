const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { readUsers, writeUsers } = require("./users")

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Add it to server/.env")
}

function publicUser(user) {
  return { id: user.id, email: user.email }
}

function signToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!token) {
    return res.status(401).json({ error: "Sign in required." })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: "Sign in required." })
  }
}

function register(req, res) {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
  const password = typeof req.body.password === "string" ? req.body.password : ""
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required." })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." })
  }
  const users = readUsers()
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ error: "An account with that email already exists." })
  }
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  res.status(201).json({ token: signToken(user), user: publicUser(user) })
}

function login(req, res) {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
  const password = typeof req.body.password === "string" ? req.body.password : ""
  const user = readUsers().find((item) => item.email === email)
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Email or password is wrong." })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
}

function me(req, res) {
  const user = readUsers().find((item) => item.id === req.userId)
  if (!user) return res.status(401).json({ error: "Sign in required." })
  res.json({ user: publicUser(user) })
}

module.exports = { requireAuth, register, login, me }