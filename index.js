const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan('tiny'))


// list is not a const value remember that or else you wont be able to modify it 
let phoneBookList = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {

    return String(Math.floor(Math.random() * 99999))

}

app.post("/api/persons", (request , response)=>{

    const body = request.body

    if(!body.name || !body.number){

        return response.status(400).json({
            error: "Complete all required fields"
        })

    } else if (phoneBookList.some(person => person.name === body.name)){

        return response.status(400).json({
            error: "name is already in phonebook"
        })

    } else {

    const person = {

        "id": generateId(),
        "name": body.name,
        "number": body.number

    } 

    phoneBookList = phoneBookList.concat(person)

    response.json(person)

}

    
})



app.get("/api/persons", (request , response) =>{

    response.json(phoneBookList)

})

app.get("/api/persons/:id",(request,response)=>{

    //dont forget params before id
    personId = request.params.id
    person = phoneBookList.find(p => personId === p.id)

    if(person){

    response.json(person)

    } else {

        response.statusMessage = "Person not found in phonebook"
        response.status(404).end()
    }
}) 

app.delete("/api/persons/:id",(request,response)=>{

    personId = request.params.id
    phoneBookList = phoneBookList.filter(p => personId !== p.id)

    response.status(204).end()

})

app.get("/info", (request , response) =>{

    response.send(
    `<p>Phonebook has info for ${phoneBookList.length} people</p>
    <p>${Date()}<p>`
    )
})


const PORT = 3001

app.listen(PORT,()=>{

    console.log(`Server is running on port: ${PORT}`)
})