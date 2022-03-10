const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
morgan.token('body', (req, res) => JSON.stringify(req.body) )

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040112131",
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) 
      return response.status(400).json({ 
        error: 'content missing' 
      })

    if(persons.find(person => person.name === body.name))
      return response.status(409).json({
        error: 'name must be unique'
      })
  
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }
  
    persons.push(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
