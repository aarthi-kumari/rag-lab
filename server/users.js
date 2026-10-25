const fs = require("fs")
const path = require("path")

const usersPath = path.join(__dirname, "data", "users.json")

function readUsers(){
    if(!fs.existsSync(usersPath)) return []
    const raw = fs.readFileSync(usersPath, "utf8")
    if(!raw) return []
    return JSON.parse(raw)
}
function writeUsers(users){
    fs.mkdirSync(path.dirname(usersPath), { recursive: true })
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2))
}

module.exports = { readUsers, writeUsers}