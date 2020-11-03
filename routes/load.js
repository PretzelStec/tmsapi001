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
const Pickup = mongoose.model('pickup', require('../schemas/Pickup'));
const Drop = mongoose.model('drop', require('../schemas/Drop'));
const Load = require('../models/Load');

router.get('/', authenticateToken, (req, res, next) => {  
    Load.find({companyID:req.user.companyID})
    .exec()
    .then(loads => {
        return res.status(200).json({
            status: "success",
            loads : loads
        })
    })
    .catch(err => {
        return res.status(404).json({
            status: "failed",
            error:err
        })
    })
})

router.get('/:id', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "return load"
    })
})

router.post('/', authenticateToken, (req, res, next) => {
    const newLoad = new Load({
        companyID: req.user.companyID,
        _id : mongoose.Types.ObjectId(),
        customer: req.body.customer, // required
        commodity: req.body.commodity, // required
        weight: req.body.weight, // required
        rate: req.body.rate, // required
        //truck: {type: mongoose.Schema.ObjectId, ref: 'truck'}, // required
        status: req.body.status, // ["upcoming", "current", "previous"]
        bol: req.body.bol,
        bolPath: req.body.bolPath,
        scale: req.body.scale,
        scalePath: req.body.scalePath,
        lumper: req.body.lumper,
        lumberPath: req.body.lumberPath,
        inventory: req.body.inventory,
        inventoryPath: req.body.inventoryPath,
        other1: req.body.other1,
        other1Path: req.body.other1Path,
        other2: req.body.other2,
        other2Path: req.body.other2Path,
        locationImage: req.body.locationImage,
        dispatch: req.user.userID, //required... set to user who makes the load
        driver: req.body.driver, // not required
        notes: req.body.notes
    })

    //load in pickups
    for (x of req.body.pickup){
        newPick = new Pickup({
            order: x.order,
            date: x.date,
            shipper: x.shipper,
            street: x.street,
            city: x.city,
            state: x.state,
            zip: x.zip,
            notes: x.notes,
        })
        newLoad.pickup.push(newPick);
    }
    //load in drops
    for (x of req.body.drop){
        newDrop = new Drop({
            order: x.order,
            date: x.date,
            receiver: x.receiver,
            street: x.street,
            city: x.city,
            state: x.state,
            zip: x.zip,
            notes: x.notes,
        });
        newLoad.drop.push(newDrop);
    }

    //console.log(newLoad);
    newLoad
    .save()
    .then(load => {
        res.status(201).json({
            status: "success",
            message: "load added successfully"
        })
    })
    .catch(err => {
        res.status(401).json({
            status:"failed",
            error: err
        })
    });

})


router.patch('/edit/driver', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "driver edited"
    })
})

module.exports = router