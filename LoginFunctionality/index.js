import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const app = express()
app.use(express.json())

const users = []

//sign up

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

//login 

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await loginUser(username, password)
        const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.set("Authorization", `Bearer ${token}`).sendStatus(200)
        //res.send({ message: "User created!" })
    } catch (err) {
        res.status(500).send({ error: `Unauthorized: ${err}` })
    }
})

async function loginUser(username, password){
    const existingUser = users.find(user => user.username === username)
    if(!existingUser) throw new Error("Invalid credentials, invalid username")

    const passwordMatch = await bcrypt.compare(password, existingUser.password)
    if(!passwordMatch) throw new Error("Invalid credentials, invalid password")

    return {username: existingUser.username}
}

app.listen(3000)

