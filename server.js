const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const app = express()
const userRoutes=require('./Routes/userRoutes')
const cors=require('cors')
const bodyParser = require('body-parser')



const PORT = 7000

//Middleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({origin:true}))
app.use(bodyParser.json());

app.use('/',userRoutes)

app.get('/', (req, res) => {
res.send('Hello World')
})
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server now listening to port ${PORT}`);
    }) 
}).catch((error)=>{
    console.log(error);
})

