const mongoose = require('mongoose');
require('mongoose-type-email')

const Pickup = new mongoose.Schema({
    date:String,
    shipper: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    notes: String,
});

module.exports = Pickup;