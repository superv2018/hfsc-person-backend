const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')


app.use(express.json())
morgan.token('host', (req, res) => {
    console.log(req.body)
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :host'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: 1 },
  { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
];

app.get("/", (request, response) => {
  response.send("Hello World");
});

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for
     ${persons.length} people <p> ${Date()}</p>`)
    
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const randomId = () => {
    return Math.floor(Math.random() * 1000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
   

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content is missing'
        })
    }

    
    
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: randomId()
    }

    persons = persons.concat(person);

    res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        return res.status(404).json({
            error: 'content is missing'
        })
    }

    person.name = req.body.name;
    person.number = req.body.number;

    res.json(person)
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
