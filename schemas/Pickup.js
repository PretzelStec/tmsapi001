const mongoose = require('mongoose');
require('mongoose-type-email')

const Pickup = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    date:String,
    shipper: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    notes: String,
});

module.exports = Pickup;