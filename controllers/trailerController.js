const mongoose = require('mongoose');
const Trailer = require('../models/Trailer');

exports.getAllTrailers = (req, res, next)=>{
    Trailer.find({MC : req.user.companyID})
    .exec()
    .then(trailers => {
        res.status(200).json({
            status: "success",
            trailers : trailers
        })
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
}

exports.getTrailerDetails = (req, res, next)=>{
    Trailer.findOne({plate : req.params.lp})
    .exec()
    .then(trailer => {
        if(trailer){
            res.status(200).json({
                status: "success",
                trailer : trailer
            })
        }else{
            res.status(404).json({
                status: "failed",
                message: "no trailer with that license plate number"
            })
        }
    })
    .catch(err => {
        res.status(401).json({
            status: "failed"
        })
    })
}

exports.postTrailer = (req, res, next) => {
    if(req.body.Plate){
        Trailer.findOne({Plate : req.body.Plate})
        .exec()
        .then(trailer => {
            if(trailer){
                res.status(409).json({
                    status: "failed",
                    message: "a Trailer with that license plate already exists"
                })
            }else{
                const newTrailer = Trailer({
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
                    Make : req.body.Make,
                    Vin : req.body.Vin,

                    // User Info
                    Fname : req.body.Fname,
                    Lname : req.body.Lname,
                    MC : req.user.companyID,
                    OwnerCity : req.body.OwnerCity,
                    OwnerState: req.body.OwnerState,
                    OwnerZip : req.body.OwnerZip
                });
                newTrailer
                .save()
                .then(doc => {
                    res.status(201).json({
                        status: "success",
                        message: "successfully created new Trailer"
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
