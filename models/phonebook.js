const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI


mongoose.connect(url)
    .then(result => {

        console.log("connected to database");
        
    })
    .catch(error =>{
        console.log(`error while connecting: ${error}`)
    })


const personSchema = new mongoose.Schema({
    name: {

        type: String,
        minLength: [3, "Name must be at least 3 characters long"], 
        required: true
    },
    number: {
        type: String,
        minLength: [8,"number must be at least 8 digits long"],
        validate : {  
            validator: (v) => /^\d{2,3}-\d+$/.test(v), 
            message : props => `${props.value} is not a valid phone number format!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })



module.exports = mongoose.model('person',personSchema)