const express = require('express') ; 
const mongoose = require('mongoose');
const dotenv = require('dotenv') ; 
const bodyParser = require('body-parser') ;
const rateLimit = require("express-rate-limit");
const app =express(); 
dotenv.config();
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 5 // limit each IP to 100 requests per windowMs
  });
//Connection to DB
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser:true , 
    useUnifiedTopology:true
},()=>{
    console.log("Connected to DB");  
}) ; 
//Middle ware
app.use(bodyParser.urlencoded({
    extended:false,
})) ;
app.use(bodyParser.json());
app.use(limiter) ; 
//body parser 

//import route
const authRouter  = require('./Routes/auth') ; 
const postRouter = require('./Routes/post');
//Route app middle ware

app.use('/api/user/' , authRouter) ; 
app.use('/api/posts/'  , postRouter);

app.listen(3000 , ()=>{
    console.log("server up at 3000 port");  
});