const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// instantiate the router
const router = express.Router();

// get user model
const User = require('../models/User');
const Company = require('../models/Company');

router.get('/login', (req, res, next)=>{
    //console.log(req.body)
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            res.status(401).json({
                status: "failed",
                message: "Invalid Email and Password"
            })
        }else{
            bcrypt.compare(req.body.password, user[0].password, (err, same)=>{
                if(err){
                    res.status(500).json({
                        status: "failed",
                        error: err
                    })
                }else if(!same){
                    res.status(401).json({
                        status: "failed",
                        message: "Invalid Email and Password"
                    })
                }else{
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
})

// will need to be redone to include company
router.post('/register', async (req, res, next)=>{
    //console.log(req)
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
    
    const a = await coRes
    const b = await usRes

    if (a || b){
        return res.status(401).json({
            status: "failed",
            message:"company or email exists"
        })
    }else{
        bcrypt.hash(req.body.user.password, 10, (err, hash)=>{
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                username: req.body.user.username,
                email: req.body.user.email,
                password: hash,
                companyID: req.body.company.MC,
                role: "ADMIN",
                phone: req.body.user.phone
            })
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
})


module.exports = router;