import express from "express"


const app = express();
app.use(express.json())

app.send("/login", (req, res) =>{
    const {username, password} = req.body

    const user = authenticateUser(username, password);
})

async function authenticateUser(username, password) {
    const user = users.find(u => u.username === username)
    if (!user) throw new Error("Invalid credentials")
  
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error("Invalid credentials")
  
    return { username: user.username }
  }
  