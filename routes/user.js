const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// instantiate the router
const router = express.Router();

// get user model
const User = require('../models/User');

router.get('/login', (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            res.status(409).json({
                status: "failed",
                message: "Invalid Email and Password"
            })
        }else{
            bcrypt.compare(req.body.password, user[0].password, (err, same)=>{
                if(err){
                    res.status(401).json({
                        status: "failed",
                        error: err
                    })
                }else if(!same){
                    res.status(409).json({
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
        res.status(401).json({
            status: "failed",
            error: err
        })
    })
})

router.post('/register', (req, res, next)=>{
    User.find({email : req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            res.status(409).json({
                status: "failed",
                message: "Invalid Email"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    res.status(500).json({
                        status:"failed",
                        error : err
                    })
                }else{
                    const newUser = new User({
                        _id: new mongoose.Types.ObjectId,
                        username: req.body.username,
                        email: req.body.email,
                        companyID : req.body.companyID,
                        password: hash,
                        role: "ADMIN"
                    })
                    newUser
                    .save()
                    .then(()=>{
                        res.status(201).json({
                            status:"success",
                        })
                    })
                    .catch(err=>{
                        res.status(401).json({
                            status: "failed",
                            error: err
                        })
                    })
                }
            })
        }
    })
    .catch(err => {
        res.status(401).json({
            status: "failed",
            error: err
        })
    })
})


module.exports = router;