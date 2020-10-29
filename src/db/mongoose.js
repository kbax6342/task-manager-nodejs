 const mongoose = require('mongoose')
 const validator = require('validator')

 mongoose.connect(process.env.MONGODB_URL , {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
 }).then(() => {
     console.log('Connection was successful')
 }).catch((error) => {
     console.log(error)
     
 })


