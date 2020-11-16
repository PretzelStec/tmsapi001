const mongoose = require('mongoose');
require('mongoose-type-email')

/*

{
    "fname":"",
    "lname":"",
    "phone":"",
    "email":"",
    "password":""
}

*/

const User = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    image:{
        type: String
    },
    imagePath:{
        type:String
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
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
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    zip:{
        type: Number
    }
});

module.exports = User;