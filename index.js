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

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        next(error)
      })
})

app.put('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    const note = {
      content: request.body.content,
      important: request.body.important,
    }
    
    Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
        next(error)
      })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => {
        next(error)
      })
})
  
app.post('/api/notes', (request, response, next) => {
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
  
    Note.create(note) 
      .then(note => {
        response.json(note)
      })
      .catch(error => {
        next(error)
      })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})