const mongoose = require('mongoose');
const Customer = require('../models/Customer');

exports.getAllCustomers = (req, res, next) => {
    Customer.find({postedByMC:req.user.companyID})
    .exec()
    .then(customers => {
        customersList = []
        for (x of customers){
            customersList.push({
                _id:x._ID,
                company:x.company,
                phone: x.phone,
                physicalCity: x.physicalCity,
                physicalState: x.physicalState
            })
        }

        res.status(200).json({
            status:"success",
            customers:customersList
        })
    })
    .catch(err=>{
        res.status(401).json({
            status:"failed",
            error:err
        })
    })
}

exports.getCustomerDetails = (req, res, next) => {
    Customer.findById(req.params.id)
    .exec()
    .then(customer => {
        if(customer){
            res.status(200).json({
                status:'success',
                customer: customer
            })
        }else{
            res.status(404).json({
                status:"failed",
                message:"no such customer found."
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

exports.postCustomer = (req, res, next) => {
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
}

exports.editCustomer = (req, res, next) => {
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
}

exports.deleteCustomer = (req, res, next) => {
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
}