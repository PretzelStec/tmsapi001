const mongoose = require('mongoose');

const User = require('../schemas/User');

const Trailer = mongoose.Schema({

    // General Info
    unit: {
        type : String,
        required: true
    },
    type: String,
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date,
    status: String,
    division: String,

    // Truck Info
    plate : {
        type : String,
        required: true
    },
    state: {
        type : String,
        required: true
    },
    model : {
        type : String,
        required: true
    },
    year: {
        type:Number,
        required: true
    },
    color: {
        type : String,
        required: true
    },
    mileage: {
        type : Number,
        required: true
    },
    make : {
        type : String,
        required: true
    },
    vin : {
        type : String,
        required: true
    },

    // User Info
    fname : {
        type : String,
        required: true
    },
    lname : {
        type : String,
        required: true
    },
    MC : {
        type : String,
        required: true
    },
    ownerCity : {
        type : String,
        required: true
    },
    ownerState: {
        type : String,
        required: true
    },
    ownerZip : {
        type : String,
        required: true
    }

})

module.exports = mongoose.model('trailer', Trailer);