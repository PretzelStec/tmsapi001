const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const authenticateToken = require('../authenticator');

const Customer = require('../models/Customer');

router.get('/', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message: "get all customers"
    })
})

router.post('/', authenticateToken, (req, res, next) => {
    newBody = req.body;
    newBody.set("postedByMC", req.user.companyID)
    newCustomer = new Customer(req.body);

    newCustomer
    .save()
    .then(cust => {
        res.status(201).json({
            status: "success",
            message:"successfully saved customer",
            customer:cust
        })
    })
    .catch(err => {
        res.status(401).json({
            status:"failed",
            error:err
        })
    })
})

module.exports = router;
