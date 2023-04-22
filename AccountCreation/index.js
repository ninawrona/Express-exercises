import express from "express"
import bcrypt from "bcrypt"

const app = express()
app.use(express.json())

const users = []

app.post("/signup", async (req, res) => {
    const { username, password } = req.body
    try {
        await createUser(username, password)
        res.send({ message: "User created!" })
    } catch (err) {
        res.status(500).send({ error: "Error signing up" })
    }
})

async function createUser(username, password) {
    const existingUser = users.find(user => user.username === username)
    if (existingUser) throw new Error("Name taken!")

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = { username, password: hashedPassword }
    users.push(newUser)
    return newUser
}

app.listen(3000)