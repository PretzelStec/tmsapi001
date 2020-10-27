const mongoose = require('mongoose');

const Data = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    },
    companyID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('data', Data);