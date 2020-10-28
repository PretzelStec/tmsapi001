const mongoose = require('mongoose');
require('mongoose-type-email')

/*

{
    "username":"",
    "phone":"",
    "email":"",
    "password":""
}

*/

const User = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    companyID: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    phone:{
        type: String
    }
});

module.exports = mongoose.model('user', User);