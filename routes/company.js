const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// require the authenticator
const authenticateToken = require('../authenticator');

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

/*
{
    "users": [
         "",
         "",
         ...
     ]
}
*/

async function getUsersOfRole(role, res, req){
    // define a new empty array
    const users = []
    // get company data

    await Company.findOne({MC : req.user.companyID})
    .exec()
    .then(async company => {
        if(company){
            const usersID = company[role];
            for(x of usersID){
                await User.findById(x)
                .exec()
                .then(user => {
                    const data = {
                        _id : user._id,
                        email : user.email,
                        fname : user.fname,
                        lname : user.lname,
                        phone : user.phone
                    }
                    users.push(data)
                })
                .catch(err => {
                    users.push({
                        error : "error getting user info"   
                    })
                })
            }
        }
    })
    .catch(err => {
        return res.status(200).json({
            status : "failed",
            error: err
        })
    });
    

    //return the array
    return users;
}

// get the user of a given list from the request
router.get('/admins', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole('admins', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/owners_operators', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole('owners_operators', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/company_drivers', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole('company_drivers', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/dispatchers', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole('dispatchers', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
})

router.get('/accountants', authenticateToken, async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole('accountants', res, req);

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
    "password":""
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


module.exports = router;

