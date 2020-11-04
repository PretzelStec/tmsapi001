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

async function getUsersOfRole(list, res){
    // define a new empty array
    const dispatchers = []
    if(list){
    //for each of the ids in the array
        for(i=0; i < list.length; i++){
            //query the user information
            await User.findById(list[i], (err, user)=>{
                if(err){
                    res.status(500).json({
                        status: "failed",
                        error:err
                    })
                }else if(!user){
                    // if the id is no longer associated with an account push this
                    dispatchers.push({error: "user no longer exists"})
                }else{
                    // the id is valid push the email and phone
                    dispatchers.push({
                        fname: user.fname,
                        lname: user.lname,
                        email: user.email,
                        phone: user.phone
                    });
                }
            })
        }
    }
    //return the array
    return dispatchers;
}

// get the user of a given list from the request
router.get('/users', authenticateToken, async (req, res, next)=>{

    //call our function defined above to get users data which returns an array
    const users = await getUsersOfRole(req.body.users, res);

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
    const roles = ["admins", "drivers", "accountants", "dispatchers"]
    
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

