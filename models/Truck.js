const mongoose = require('mongoose');

const User = require('../schemas/User');

const Truck = mongoose.Schema({

    // General Info
    unit: String,
    type: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    status: String,
    division: String,

    // Truck Info
    plate : String,
    state: String,
    model : String,
    year: Number,
    color: String,
    mileage: Number,
    make : String,
    fuelcard : String,
    fueltype : String,
    ipass: String,
    vin : String,

    // User Info
    fname : String,
    lname : String,
    MC : String,
    ownerCity : String,
    ownerState: String,
    ownerZip : String

})

module.exports = mongoose.model('truck', Truck);