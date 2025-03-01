require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/phonebook')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('dist'))


app.post("/api/persons", (request , response)=>{

    const body = request.body

    if(!body.name || !body.number){

        return response.status(400).json({
            error: "Complete all required fields"
        })

    }  else {

    const person = new Person({

        "name": body.name,
        "number": body.number

    }) 

    person.save().then(savedPerson => response.json(savedPerson))
   
}

    
})

app.get("/api/persons", (request , response) =>{
   
    Person.find({}).then(person => response.json(person))

})

app.get("/api/persons/:id",(request,response)=>{

    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(() => {
            response.statusMessage = "Person not found in phonebook"
            response.status(404).end()})

}) 

app.delete("/api/persons/:id",(request,response)=>{

    Person.findByIdAndDelete(request.params.id).then(() =>{
        
        response.status(204).end()

    })
    
    
})

app.get("/info", (request , response) =>{

    response.send(
    `<p>Phonebook has info for people</p>
    <p>${Date()}<p>`
    )
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const PORT = process.env.PORT

app.listen(PORT,()=>{

    console.log(`Server is running on port: ${PORT}`)
})