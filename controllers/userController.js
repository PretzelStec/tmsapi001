const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('user', require('../schemas/User'));
const Company = require('../models/Company');
const Truck = require('../models/Truck');

exports.getMyInfo = (req, res, next)=>{
    User.findById(req.user.userID)
    .exec()
    .then(user => {
        if(user){
            res.status(200).json({
                status:'success',
                user:user
            })
        }else{
            res.status(404).json({
                status:"failed",
                message:"user does not exist."
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            status: "failed",
            error:err
        })
    })
}

exports.login = (req, res, next)=>{
        // find a user with the email
        User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                // no user exists return 401
                res.status(401).json({
                    status: "failed",
                    message: "Invalid Email and Password"
                })
            }else{
                // user exists compare the given and stored password/hashes and see if 
                // theyre valid
                bcrypt.compare(req.body.password, user[0].password, (err, same)=>{
                    if(err){
                        res.status(500).json({
                            status: "failed",
                            error: err
                        })
                    }else if(!same){
                        // passwords dont match
                        res.status(401).json({
                            status: "failed",
                            message: "Invalid Email and Password"
                        })
                    }else{
                        // passwords match. create token with secret key and return the token
                        const token = jwt.sign({
                            userID: user[0]._id,
                            companyID: user[0].companyID,
                            role: user[0].role
                        }, process.env.SECRET_KEY);
                        res.json({
                            status: "success",
                            token:token
                        })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                status: "failed",
                error: err
            })
        })
}

exports.register = async (req, res, next)=>{
    // we want to check both the given companyID/MC/DOT and the user email
    const coRes =  Company.findOne({MC: req.body.company.MC})
    .exec()
    .catch(err => {
        res.status(500).json({
            status: "failed",
            error: err
        })
    })    
    const usRes =  User.findOne({email: req.body.user.email})
    .exec()
    .catch(err => {
        res.status(500).json({
            status: "failed",
            error: err
        })
    })
    
    // set the results of the query here
    const a = await coRes
    const b = await usRes

    // if either the companyID or the email exists return failed
    if (a || b){
        return res.status(401).json({
            status: "failed",
            message:"company or email exists"
        })
    }else{
        // company and email doesnt already exist so hash password
        bcrypt.hash(req.body.user.password, 10, (err, hash)=>{
            // create new user
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                fname: req.body.user.fname,
                lname: req.body.user.lname,
                email: req.body.user.email,
                password: hash,
                companyID: req.body.company.MC,
                role: "admins",
                city: req.body.user.city,
                state: req.body.user.state,
                zip : req.body.user.zip,
                phone: req.body.user.phone
            })
            // create new company
            const newCompany = new Company({
                _id: mongoose.Types.ObjectId(),
                MC:req.body.company.MC,
                name: req.body.company.name,
                state: req.body.company.state,
                city: req.body.company.city,
                street: req.body.company.street,
                street2: req.body.company.street2,
                zipCode: req.body.company.zipCode,
                officePhone: req.body.company.officePhone
            })

            // push the user's ID we made into the admins array
            newCompany.admins.push(newUser._id);
            
            //save the new user then the company to the DB
            newUser
            .save()
            .then(user=>{
                newCompany
                .save()
                .then(comp => {
                    return res.status(201).json({
                        status: "success",
                        message: "company and user successfully created."
                    })
                })
                .catch(err => {
                    // if we catch an error in the validation of the company we delete
                    // the submitted user.
                    User.findByIdAndDelete(newUser._id, (err2, user)=>{
                        if(err2){
                            return res.status(500).json({
                                status: "failed",
                                error: err2
                            })
                        }else{
                            return res.status(400).json({
                                status: "failed",
                                error: "invalid company data"
                            })
                        }
                    })
                })
            })
            .catch(err => {
                res.status(500).json({
                    status: "failed",
                    error: err
                })
            })
        })
    }
}

exports.updatePassword = (req, res, next)=> {
    // query the user that is logged in
    User.findById(req.user.userID, (err, user)=>{
        if(err || !user){
            res.status(500).json({
                status: "failed",
                error:err
            })
        }else{
            // get current password and check if it matches
            bcrypt.compare(req.body.password, user.password, (err, valid)=> {
                if(err){
                    res.status(500).json({
                        status: "failed",
                        error:err
                    })
                }else if(!valid){
                    // not valid password
                    res.status(401).json({
                        status: "failed",
                        message: "old password does not match"
                    })
                }else{
                    // password matches.. now we add the new one
                    // hash the new password
                    bcrypt.hash(req.body.newPassword, 10, (err, hash)=>{
                        if(err){
                            res.status(500).json({
                                status: "failed",
                                error:err
                            })
                        }else{
                            // make our current user's password = hash
                            user.password = hash;
                            // save the user
                            user.save()
                            .then(data=>{
                                //successful update
                                res.status(201).json({
                                    status: "success",
                                    message: "successfully changed password"
                                })
                            })
                            .catch(err =>{
                                res.status(500).json({
                                    status: "failed",
                                    error:err
                                })
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.getUserDetails = (req, res, next) =>{
    User.findById(req.params.id)
    .exec()
    .then(user => {
        if (user){
            res.status(200).json({
                status:'success',
                user:{
                    _id:user._id,
                    fname: user.fname,
                    lname: user.lname,
                    email:user.email,
                    role: user.role,
                    phone: user.phone
                }
            })
        }else{
            res.status(404).json({
                status:"failed",
                message:"user doesnt exist."
            })
        }
    })
}

exports.updateTruck = (req, res, next) => {
    User.findById(req.user.userID)
    .exec()
    .then(user => {
        if(user){
            Truck.findById(req.body.truckId)
            .exec()
            .then(truck => {
                if(truck){
                    user.truck = truck._id
                    user
                    .save()
                    .then(u => {
                        res.status(200).json({
                            status:"success",
                            message:"successfully update user truck"
                        })
                    })
                    .catch(err => {
                        res.status(400).json({
                            status:"failed",
                            error:err
                        })
                    })
                }else{
                    res.status(404).json({
                        status:"failed",
                        message:"truck does not exist"
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    status:"failed",
                    error:err
                })
            })
            
        }else{
            res.status(404).json({
                status:"failed",
                message:"user does not exist"
            })
        }
    })
    .catch(err => {
        res.status(400).json({
            status:"failed",
            error:err
        })
    })
}