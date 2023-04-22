import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const app = express()
app.use(express.json())
//app.use(cors({ exposedHeaders: "Authorization" }))

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

//web page that requires authentication
app.get("/protected", requireAuth, (req, res) => {
    res.send({ message: "You entered an protected page!" })
})

function requireAuth(req, res, next){
    const token = req.headers.authorization?.split(" ")[1]
    if(!token) return res.status(401).send({error: "unauthorized"})

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({error:"Unauthorized"})
        req.user = decoded
        next()
    })
}

app.listen(3000)

