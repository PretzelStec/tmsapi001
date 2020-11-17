const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const authenticateToken = require('../authenticator');

const Customer = require('../models/Customer');

router.get('/', authenticateToken, (req, res, next) => {
    Customer.find({postedByMC:req.user.companyID})
    .exec()
    .then(customers => {
        res.status(200).json({
            status:"success",
            customers:customers
        })
    })
    .catch(err=>{
        res.status(401).json({
            status:"failed",
            error:err
        })
    })
})

router.post('/', authenticateToken, (req, res, next) => {
    newBody = req.body;
    newBody.postedByMC = req.user.companyID;
    newCustomer = new Customer(newBody);

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

router.patch('/:id', authenticateToken, (req, res, next) => {
    Customer.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(custommer => {
        res.status(201).json({
            status:"success",
            message:"successfully updated customer"
        })
    })
    .catch(err => {
        res.status(400).json({
            status:"failed",
            error:err
        })
    })
})

router.delete('/:id', authenticateToken, (req, res, next) => {
    Customer.findByIdAndDelete(req.params.id)
    .exec()
    .then(customer => {
        res.status(202).json({
            status: "success",
            message: "successfully deleted Customer"
        })
    })
    .catch(err => {
        res.status(400).json({
            status: "failed",
            error: err
        })
    })
})

module.exports = router;
