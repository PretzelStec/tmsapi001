const mongoose = require('mongoose');

const Truck = mongoose.Schema({

    // General Info
    Unit: {
        type : String,
        required: true
    },
    Type: String,
    StartDate: {
        type: Date,
        default: Date.now
    },
    EndDate: Date,
    Status: String,
    Division: String,

    // Truck Info
    Plate : {
        type : String,
        required: true
    },
    State: {
        type : String,
        required: true
    },
    Model : {
        type : String,
        required: true
    },
    Year: {
        type:Number,
        required: true
    },
    Color: {
        type : String,
        required: true
    },
    Mileage: {
        type : Number,
        required: true
    },
    Make : {
        type : String,
        required: true
    },
    Fuelcard : String,
    Fueltype : {
        type : String,
        required: true
    },
    Ipass: String,
    Vin : {
        type : String,
        required: true
    },

    // User Info
    Fname : {
        type : String,
        required: true
    },
    Lname : {
        type : String,
        required: true
    },
    MC : {
        type : String,
        required: true
    },
    OwnerCity : {
        type : String,
        required: true
    },
    OwnerState: {
        type : String,
        required: true
    },
    OwnerZip : {
        type : String,
        required: true
    }

})

module.exports = mongoose.model('truck', Truck);