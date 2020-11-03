const mongoose = require('mongoose');
require('mongoose-type-email')

const Drop = new mongoose.Schema({
    date:String,
    receiver: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    notes: String
});

module.exports = Drop;