const mongoose = require('mongoose');
require('mongoose-type-email')

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
    }
})

module.exports = mongoose.model('company', Company);