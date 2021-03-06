const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.rnlgi.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.map(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name,
    number
  })
  person
    .save(person)
    .then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
}