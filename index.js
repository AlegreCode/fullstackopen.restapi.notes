const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Note = require('./db/model')

require('./db/connect');


const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny'))

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true
//   }
// ]

app.get('/api/notes', (request, response) => {
  Note.find().then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findById(id).then(note => {
        response.json(note)
    })
})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    Note.findByIdAndUpdate(id, body, { new: true }).then(note => {
        response.json(note)
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id).then(() => {
        response.status(204).end()
    })
})
  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: Boolean(body.important) || false,
    }
  
    Note.create(note).then(note => {
        response.json(note)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})