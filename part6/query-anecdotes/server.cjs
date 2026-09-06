const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

let anecdotes = require('./db.json').anecdotes

const generateId = () =>
  String(Math.max(...anecdotes.map((a) => Number(a.id)), 0) + 1)

app.get('/anecdotes', (request, response) => {
  response.json(anecdotes)
})

app.post('/anecdotes', (request, response) => {
  const { content } = request.body

  if (!content || content.length < 5) {
    return response
      .status(400)
      .json({ error: 'too short anecdote, must have length 5 or more' })
  }

  const newAnecdote = { content, id: generateId(), votes: 0 }
  anecdotes = anecdotes.concat(newAnecdote)
  response.status(201).json(newAnecdote)
})

app.put('/anecdotes/:id', (request, response) => {
  const id = request.params.id
  const anecdote = anecdotes.find((a) => a.id === id)

  if (!anecdote) {
    return response.status(404).end()
  }

  const updated = { ...anecdote, ...request.body, id }
  anecdotes = anecdotes.map((a) => (a.id === id ? updated : a))
  response.json(updated)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
