const mongoose = require('mongoose');
require('mongoose-type-email')

const UserSchema = require('../schemas/User');

/* 

{
    "MC":"",
    "name":"",
    "state":"",
    "city":"",
    street:"",
    "street2":"",
    "zipCode":"",
    "officePhone":"" 
}

*/

const Company = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    MC: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    street2: {
        type: String
    },
    zipCode: {
        type: String,
        required: true
    },
    officePhone: {
        type: String,
        required: true
    },
    dispatchers: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
    company_drivers: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
    owners_operators: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
    admins: [{type: mongoose.Schema.ObjectId, ref: 'user'}],
    accountants: [{type: mongoose.Schema.ObjectId, ref: 'user'}]
})

module.exports = mongoose.model('company', Company);