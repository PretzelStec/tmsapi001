const mongoose = require('mongoose');
require('mongoose-type-email')

const Drop = require('../schemas/Drop');
const Pickup = require('../schemas/Pickup');

const Load = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
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
    //add dispactch
    //add driver
    //add load
    pickup: [Pickup],
    drop: [Drop]
})

module.exports = mongoose.model('load', Load)