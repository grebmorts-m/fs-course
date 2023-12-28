const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  //`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
  `mongodb+srv://mstr:${password}@cluster0.nugazgd.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

if (process.argv.length===3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length===5) {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })

}

/* person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
}) */

/* Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
}) */