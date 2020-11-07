const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// instantiate our app
const app = express();

// Routes to be used
const userRoutes = require('./routes/user');
const companyRoutes = require('./routes/company');
const loadRoutes = require("./routes/load");

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

// CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// use routes
app.get('/', (req, res, next) => {
    res.status(201).json({
        message: "Welcome to TMS API v 0.0.1"
    })
});

app.use('/user', userRoutes);
app.use('/company', companyRoutes);
app.use('/load', loadRoutes);

app.post('/debug', (req, res, nexy)=> {
    res.status(200).json(req.body)
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server started...')
})