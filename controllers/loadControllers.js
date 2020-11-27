const mongoose = require('mongoose');

const Pickup = mongoose.model('pickup', require('../schemas/Pickup'));
const Drop = mongoose.model('drop', require('../schemas/Drop'));
const Load = require('../models/Load');

// TODO: Change loads to use form data instead, for use with files

// TODO: make this return general information discuss with iskandar
exports.getAllLoads = (req, res, next) => {  
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
}

// TODO: full implement this feature
exports.getLoadDetails = (req, res, next) => {
    res.status(200).json({
        message : "return load"
    })
}

exports.postLoad = (req, res, next) => {
    const newLoad = new Load({
        companyID: req.user.companyID,
        _id : mongoose.Types.ObjectId(),
        customer: req.body.customer, // required
        commodity: req.body.commodity, // required
        weight: req.body.weight, // required
        rate: req.body.rate, // required
        truck: req.body.truck, // required
        status: req.body.status || 'upcoming', // ["upcoming", "current", "previous"]
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

}

exports.editLoad = (req, res, next) => {
    Load.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(load => {
        return res.status(201).json({
            status:"success",
            message:"successfully updated load",
        })
    })
    .catch(err => {
        return res.status(400).json({
            status:"failed",
            error:err
        })
    })
}

exports.deleteLoad = (req, res, next) => {
    Load.findByIdAndDelete(req.params.id)
    .exec()
    .then(load => {
        res.status(202).json({
            status: "success",
            message: "successfully deleted load"
        })
    })
    .catch(err => {
        res.status(400).json({
            status: "failed",
            error: err
        })
    })
}

exports.getMyLoads = (req, res, next) => {
    Load.find({driver:req.user.userID})
    .exec()
    .then(loads => {
        //console.log(loads)
        res.status(200).json({
            status:"success",
            loads:loads
        })
    })
    .catch(err => {
        res.status(400).json({
            status:"failed",
            error:err
        })
    })
}

exports.bumpLoadState = (req, res, next) => {
    let states = ['upcoming', 'current', 'previous'];
    Load.findById(req.params.id)
    .exec()
    .then(load => {
        if(load){
            if(load.companyID == req.user.companyID){
                if(load.status != states[2]){
                    load.status = states[states.indexOf(load.status)+1]
                }
                load.save()
                .then(o => {
                    res.status(200).json({
                        status:"success",
                        message:"successfully bumped up load status"
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        status: "failed",
                        error:err
                    })
                })
            }else{
                res.status(401).json({
                    status:"failed",
                    message:"unauthorized to access this load functions."
                })
            }
        }
    })
    .catch(err => {
        res.status(400).json({
            status:'failed',
            error: err
        })
    })
}