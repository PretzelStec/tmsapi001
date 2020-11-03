const mongoose = require('mongoose');
require('mongoose-type-email')

const Drop = require('../schemas/Drop');
const Pickup = require('../schemas/Pickup');

const Load = new mongoose.Schema({
    companyID: Number,
    _id : mongoose.Schema.Types.ObjectId,
    customer: String, // required
    commodity: String, // required
    weight: Number, // required
    rate: Number, // required
    //truck: {type: mongoose.Schema.ObjectId, ref: 'truck'}, //
    status: String, // ["upcoming", "current", "previous"]
    bol: String,
    bolPath: String,
    scale: String,
    scalePath: String,
    lumper: String,
    lumberPath: String,
    inventory: String,
    inventoryPath: String,
    other1: String,
    other1Path: String,
    other2: String,
    other2Path: String,
    locationImage: String,
    dispatch:{type: mongoose.Schema.ObjectId, ref: 'user'}, //required
    driver:{type: mongoose.Schema.ObjectId, ref: 'user'}, // not required
    pickup: [Pickup],
    drop: [Drop],
    notes: String
})

module.exports = mongoose.model('load', Load)