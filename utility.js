const mongoose = require('mongoose');
const Company = require('./models/Company');
const User = mongoose.model('user', require('./schemas/User'));

async function getUsersOfRole(role, res, req){
    // define a new empty array
    const users = []
    // get company data

    await Company.findOne({MC : req.user.companyID})
    .exec()
    .then(async company => {
        if(company){
            const usersID = company[role];
            for(x of usersID){
                await User.findById(x)
                .exec()
                .then(user => {
                    const data = {
                        _id : user._id,
                        email : user.email,
                        fname : user.fname,
                        lname : user.lname,
                        phone : user.phone
                    }
                    users.push(data)
                })
                .catch(err => {
                    users.push({
                        error : "error getting user info"   
                    })
                })
            }
        }
    })
    .catch(err => {
        return res.status(200).json({
            status : "failed",
            error: err
        })
    });
    

    //return the array
    return users;
}

module.exports.getUsersOfRole = getUsersOfRole;
