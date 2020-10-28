const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// instantiate our app
const app = express();

// Routes to be used
const userRoutes = require('./routes/user');

// Connect to database
mongoose.connect(
    process.env.ATLAS_URL,
    {
        useNewUrlParser:true,
        useUnifiedTopology: true
    },
    (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Connected to database...');
        }
    }
)

// use json formats
app.use(express.json());

// use routes
app.get('/', (req, res, next) => {
    res.status(201).json({
        message: "Welcome to TMS API v 0.0.1"
    })
});

app.use('/user', userRoutes);

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server started...')
})