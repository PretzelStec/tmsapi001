const mongoose = require('mongoose');
const Truck = require('../models/Truck');

exports.getAllTrucks = (req, res, next)=>{
    Truck.find({MC : req.user.companyID})
    .exec()
    .then( trucks => {
        res.status(200).json({
            status: "success",
            trucks : trucks
        })
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
}

exports.getTruckDetails = (req, res, next)=>{
    Truck.findOne({Plate : req.params.lp})
    .exec()
    .then(truck => {
        if(truck){
            res.status(200).json({
                status: "success",
                truck : truck
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "no truck with that license plate number"
            })
        }
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
}

exports.postTruck = (req, res, next)=> {
    if(req.body.Plate){
        Truck.findOne({Plate : req.body.Plate})
        .exec()
        .then(truck => {
            if(truck){
                res.status(409).json({
                    status: "failed",
                    message: "a truck with that license plate already exists"
                })
            }else{
                const newTruck = Truck({
                    // General Info
                    Unit: req.body.Unit,
                    Type: req.body.Type,
                    StartDate: req.body.StartDate,
                    EndDate: req.body.EndDate,
                    Status: req.body.Status,
                    Division: req.body.Division,

                    // Truck Info
                    Plate : req.body.Plate,
                    State: req.body.State,
                    Model : req.body.Model,
                    Year: req.body.Year,
                    Color: req.body.Color,
                    Mileage: req.body.Mileage,
                    Make : req.body.Make,
                    Fuelcard : req.body.Fuelcard,
                    Fueltype : req.body.Fueltype,
                    Ipass: req.body.Ipass,
                    Vin : req.body.Vin,

                    // User Info
                    Fname : req.body.Fname,
                    Lname : req.body.Lname,
                    MC : req.user.companyID,
                    OwnerCity : req.body.OwnerCity,
                    OwnerState: req.body.OwnerState,
                    OwnerZip : req.body.OwnerZip
                });
                newTruck
                .save()
                .then(doc => {
                    res.status(201).json({
                        status: "success",
                        message: "successfully created new truck"
                    })
                })
                .catch(err => {
                    res.status(400).json({
                        status: "failed",
                        error : err
                    })
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                status: "failed",
                error : err
            })
        })
    }else{
        res.status(400).json({
            status: "failed",
            error : "improper body"
        })
    }
}