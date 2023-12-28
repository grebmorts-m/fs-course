require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
const { default: mongoose } = require('mongoose')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.send('<h1>Hello world</h1>')
})

/* app.get('/api/notes', (req, res) => {
    res.json(notes)
}) */

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    Note.findById(req.params.id)
    .then(note => {
        if (note) {
            res.json(note)
        } else {
            res.status(404).end()
        }              
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end
    })
    .catch(error => next(error))
})


app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(404).json({
            error: 'content missing'
        })
    }

    const note = new Note ({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
    .catch(error => next(error)) 
})

app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, 
    {new: true, runValidators: true, context: 'query'})
    .then(updatedNote => {
        res.json(updatedNote)
    })
    .catch(error => next(error)) 
})

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        return res.status(400).send({error: "malformatted id"})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on ${PORT}`)