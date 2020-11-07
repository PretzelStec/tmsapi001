const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// require the authenticator
const authenticateToken = require('../authenticator');
const utility = require('../utility'); 

// instantiate the router
const router = express.Router();

// get user model
const Company = require('../models/Company');
const User = mongoose.model('user', require('../schemas/User'));

// get company data
router.get('/', authenticateToken, (req, res, next)=>{
    Company.findOne({MC:req.user.companyID}, (err, comp)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                error:err
            })
        }else{
            res.status(200).json(comp);
        }
    })
})

// get the user of a given list from the request
router.get('/admins', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('admins', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/owners_operators', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('owners_operators', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/company_drivers', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('company_drivers', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/dispatchers', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('dispatchers', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/accountants', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('accountants', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})


// register new users under a company
/*

{
    "fname":"",
    "lname":"",
    "phone":"",
    "email":"",
    "password":"",
    "city":"",
    "state":"",
    "zip":"",
    "role": <"admins", "drivers", "accountants", "dispatchers">
}

*/
router.post('/register',authenticateToken, (req, res, next)=>{
    // make sure that the role that is given in the request is valid
    const roles = ["admins", "company_drivers", "owners_operators", "accountants", "dispatchers"]
    
    // if it is a valid array continue
    if(roles.indexOf(req.body.role) != -1){
        //find the company assosiated with the user that is adding users
        Company.findOne({MC:req.user.companyID}, (err, comp) => {
            // check if the new account information has a valid email
            User.find({email:req.body.email})
            .exec()
            .then(user => {
                // check if the new account information has a valid email
                if(user.length >= 1){
                    res.status(401).json({
                        status: "failed",
                        message:"email exists"
                    })
                }
                // this is a valid email. we can hash the password now
                else{
                    bcrypt.hash(req.body.password, 10, (err, hash)=>{
                        if(err){
                            res.status(500).json({
                                status:"failed",
                                error:err
                            })
                        }else{
                            // we hashed the password. now we can create a new user model
                            const newUser = new User({
                                _id: mongoose.Types.ObjectId(),
                                fname: req.body.fname,
                                lname: req.body.lname,
                                email: req.body.email,
                                // set the password to the hashed password
                                password: hash,
                                // set the new user companyID to the same one as the 
                                // user who created them
                                companyID: req.user.companyID,
                                role: req.body.role,
                                city: req.body.city,
                                state: req.body.state,
                                zip: req.body.zip,
                                phone: req.body.phone
                            })
                            newUser
                            .save()
                            .then(user =>{
                                // push our new user's id into the proper role of the
                                // company
                                comp[req.body.role].push(user._id);
                                comp.save()
                                .then(doc=>{
                                    // success right here
                                    return res.status(201).json({
                                        status: "success",
                                        message: "user successfully added."
                                    })
                                })
                                .catch(err=>{
                                    return res.status(400).json({
                                        status: "failed",
                                        error: err
                                    })
                                })
                            })
                            .catch(err => {
                                return res.status(400).json({
                                    status: "failed",
                                    error: err
                                })
                            })
                        }
                    })
                }
            })
            .catch()
        })
    }else{
        // if there is an invalid role in the request
        return res.status(400).json({
            status: "failed",
            error: "not proper role"
        })
    }
})

const Truck = require('../models/Truck');
const Trailer = require('../models/Trailer');

// Routes to get trucks and trailers stored in the database.

//GET ALL
router.get('/trucks', authenticateToken, (req, res, next)=>{
    Truck.find({MC : req.user.companyID})
    .exec()
    .then(trucks => {
        res.status(200).json({
            status: "success",
            trucks : trucks
        })
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
})

router.get('/trailers', authenticateToken,(req, res, next)=>{
    Trailer.find({MC : req.user.companyID})
    .exec()
    .then(trailers => {
        res.status(200).json({
            status: "success",
            trailers : trailers
        })
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
})

// GET BY LP
router.get('/trucks/:lp',authenticateToken, (req, res, next)=>{
    Truck.findOne({plate : req.params.lp})
    .exec()
    .then(truck => {
        if(truck){
            res.status(200).json({
                status: "success",
                truck : truck
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "no truck with that license plate number"
            })
        }
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
})

router.get('/trailers/:lp',authenticateToken, (req, res, next)=>{
    Trailer.findOne({plate : req.params.lp})
    .exec()
    .then(trailer => {
        if(trailer){
            res.status(200).json({
                status: "success",
                trailer : trailer
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "no trailer with that license plate number"
            })
        }
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
})


// Routes to post new trucks and trailers

router.post('/trucks', authenticateToken,(req, res, next)=> {
    if(req.body.plates){
        Truck.findOne({plate : req.body.plate})
        .exec()
        .then(truck => {
            if(truck){
                res.status(409).json({
                    status: "failed",
                    message: "a truck with that license plate already exists"
                })
            }else{
                const newTruck = Truck({
                    // General Info
                    unit: req.body.Unit,
                    type: req.body.Type,
                    startDate: req.body.StartDate,
                    endDate: req.body.EndDate,
                    status: req.body.Status,
                    division: req.body.Division,

                    // Truck Info
                    plate : req.body.Plate,
                    state: req.body.State,
                    model : req.body.Model,
                    year: req.body.Year,
                    color: req.body.Color,
                    mileage: req.body.Mileage,
                    make : req.body.Make,
                    fuelcard : req.body.Fuelcard,
                    fueltype : req.body.Fueltype,
                    ipass: req.body.Ipass,
                    vin : req.body.Vin,

                    // User Info
                    fname : req.body.Fname,
                    lname : req.body.Lname,
                    MC : req.user.companyID,
                    ownerCity : req.body.OwnerCity,
                    ownerState: req.body.OwnerState,
                    ownerZip : req.body.OwnerZip
                });
                newTruck
                .save()
                .then(doc => {
                    res.status(201).json({
                        status: "success",
                        message: "successfully created new truck"
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        status: "failed",
                        error : err
                    })
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                status: "failed",
                error : err
            })
        })
    }else{
        res.status(400).json({
            status: "failed",
            error : "improper body"
        })
    }
})

router.post('/trailers', authenticateToken,(req, res, next) => {
    if(req.body.plates){
        Trailer.findOne({plate : req.body.plate})
        .exec()
        .then(trailer => {
            if(trailer){
                res.status(409).json({
                    status: "failed",
                    message: "a Trailer with that license plate already exists"
                })
            }else{
                const newTrailer = Trailer({
                    // General Info
                    unit: req.body.unit,
                    type: req.body.type,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    status: req.body.status,
                    division: req.body.division,

                    // Trailer Info
                    plate : req.body.plate,
                    state: req.body.state,
                    model : req.body.model,
                    year: req.body.year,
                    color: req.body.color,
                    mileage: req.body.mileage,
                    make : req.body.make,
                    vin : req.body.vin,

                    // User Info
                    fname : req.body.fname,
                    lname : req.body.lname,
                    MC : req.user.companyID,
                    ownerCity : req.body.ownerCity,
                    ownerState: req.body.ownerState,
                    ownerZip : req.body.ownerZip
                });
                newTrailer
                .save()
                .then(doc => {
                    res.status(201).json({
                        status: "success",
                        message: "successfully created new Trailer"
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        status: "failed",
                        error : err
                    })
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                status: "failed",
                error : err
            })
        })
    }else{
        res.status(400).json({
            status: "failed",
            error : "improper body"
        })
    }
})


module.exports = router;

