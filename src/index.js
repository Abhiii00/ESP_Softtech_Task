let express = require('express')
let mongoose = require('mongoose')
let route = require('./routes/route')
let app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://abhay:abhayabhay@cluster0.6itwk6b.mongodb.net/ESP_Softtech?retryWrites=true&w=majority',{
    useNewUrlParser: true
})
.then(()=>console.log('MongoDb is Connected'))
.catch((err)=> console.log(err))

app.use('/',route)

app.listen(3000, ()=>{
    console.log('Express App running on Port 3000')
})