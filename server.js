const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const app = express()
const userRoutes=require('./Routes/userRoutes')
const cors=require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');



const PORT = 7000

//Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin:true}));
app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use('/',userRoutes)

// Cookies
// app.get('/set-cookies', (req, res)=>{
//     res.cookie('newUser', false)
//     res.cookie('isEmployee', true, {expires: new Date(Date.now() + 1000 * 24), httponly:true})
//     res.send("You got your cookies")
// });
// app.get('/read-cookies', (req, res)=>{
//     const cookies = req.cookies;
//     console.log(cookies);
    
// })

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

