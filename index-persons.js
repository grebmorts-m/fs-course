const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

app.use(cors())

app.use(morgan(':method :url :status - :response-time ms :res[name]'))



app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-1234567"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-532523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-545678"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-24-5678899"
    }
]

app.get('/', (req,res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/info', (req,res) => {
    const amount = persons.length
    const d = new Date (Date.now())
    const date = d.toString()
    res.send(
        `<p>Phonebook has info for ${amount} persons</p>
        <p>${date}<p>`
        )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) { res.json(person) }
    else { res.status(404).end() }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0

    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    const added = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(404).json({
            error: 'information missing'
        })
    }

    if (added) {
        return res.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on ${PORT}`)