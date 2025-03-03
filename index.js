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


app.post("/api/persons", (request,response,next)=>{

    const body = request.body

    

    if(!body.name || !body.number){

        return response.status(400).json({
            error: "Complete all required fields"
        })

    } else{

    const person = new Person({

        "name": body.name,
        "number": body.number

    }) 

    person.save().then(savedPerson => response.json(savedPerson))
   
}

    
})

app.put("/api/persons/:id",(request,response,next) =>{

    const body = request.body

  
    const person = {

    "name" : body.name,
    "number" : body.number
            
    }

    Person.findByIdAndUpdate(request.params.id,person,{new: true})
        .then(updatedPerson => { if (updatedPerson){
            response.json(updatedPerson)}
        else response.status(404).send({error:"person not found"})})
        .catch(error => next(error))

})

app.get("/api/persons", (request,response,next) =>{
   
    Person.find({}).then(person => response.json(person))

})

app.get("/api/persons/:id",(request,response,next)=>{

    Person
    .findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            } else {
                response.statusMessage = "Person not found in phonebook"
                response.status(404).end()}
        })
        .catch(error => next(error))

}) 

app.delete("/api/persons/:id",(request,response,next)=>{

    Person
    .findByIdAndDelete(request.params.id)
        .then(() =>{
            response.status(204).end()
        })
        .catch(error => next(error))
            
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

const errorHandler = (error,request,response,next) =>{

    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)


}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT,()=>{

    console.log(`Server is running on port: ${PORT}`)
})