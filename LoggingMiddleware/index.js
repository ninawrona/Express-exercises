import express from "express"
import { POKEMON } from "./pokemon.js"

const app = express()
app.use(logger)
app.get("/", (req, res) => {
  res.send(users)
})

app.get("/:id", (req, res) => {
    const reqId = parseInt(req.params.id)
    const pokemon = POKEMON.find(poke => poke.id === reqId)
    if (pokemon) res.send(pokemon)
    else res.status(404).send({ msg: "No users with the id of " + reqId })
})

app.listen(3000)