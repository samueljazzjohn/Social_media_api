var mongoose = require('mongoose')
const uri = require('./appconfig').db.uri

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }).then((result)=>{
    console.log("Database connected successdully")
}).catch((err)=>{
    console.log("connection error",err)
})