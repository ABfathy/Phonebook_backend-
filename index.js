const express = require('express')
const app = express()

app.use(express.json())

const phoneBookList = [
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

app.get("/api/persons", (request , response) =>{

    response.json(phoneBookList)

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