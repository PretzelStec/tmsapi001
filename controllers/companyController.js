const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const utility = require('../utility'); 
const Company = require('../models/Company');
const User = mongoose.model('user', require('../schemas/User'));


exports.getCompanyData = (req, res, next)=>{
    Company.findOne({MC:req.user.companyID}, (err, comp)=>{
        if(err){
            return res.status(500).json({
                status:"failed",
                error:err
            })
        }else{
            res.status(200).json(comp);
        }
    })
}

exports.getAdmins = async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('admins', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
}

exports.getDrivers = async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const own = await utility.getUsersOfRole('owners_operators', res, req);
    const comp = await utility.getUsersOfRole('company_drivers', res, req);
    // return the array
    res.status(200).json({
        users:own.concat(comp)
    })
}

exports.getDispatchers = async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('dispatchers', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
}

exports.getAccountants = async (req, res, next)=>{
    //call our function defined above to get users data which returns an array
    const users = await utility.getUsersOfRole('accountants', res, req);

    // return the array
    res.status(200).json({
        users:users
    })
}

exports.register = (req, res, next)=>{
    // make sure that the role that is given in the request is valid
    const roles = ["admins", "company_drivers", "owners_operators", "accountants", "dispatchers"]
    
    // if it is a valid array continue
    if(roles.indexOf(req.body.role) != -1){
        //find the company assosiated with the user that is adding users
        Company.findOne({MC:req.user.companyID}, (err, comp) => {
            // check if the new account information has a valid email
            User.find({email:req.body.email})
            .exec()
            .then(user => {
                // check if the new account information has a valid email
                if(user.length >= 1){
                    res.status(401).json({
                        status: "failed",
                        message:"email exists"
                    })
                }
                // this is a valid email. we can hash the password now
                else{
                    bcrypt.hash(req.body.password, 10, (err, hash)=>{
                        if(err){
                            res.status(500).json({
                                status:"failed",
                                error:err
                            })
                        }else{
                            // we hashed the password. now we can create a new user model
                            const newUser = new User({
                                _id: mongoose.Types.ObjectId(),
                                fname: req.body.fname,
                                lname: req.body.lname,
                                email: req.body.email,
                                // set the password to the hashed password
                                password: hash,
                                // set the new user companyID to the same one as the 
                                // user who created them
                                companyID: req.user.companyID,
                                role: req.body.role,
                                city: req.body.city,
                                state: req.body.state,
                                zip: req.body.zip,
                                phone: req.body.phone,
                                truck: req.body.truck
                            })
                            newUser
                            .save()
                            .then(user =>{
                                // push our new user's id into the proper role of the
                                // company
                                comp[req.body.role].push(user._id);
                                comp.save()
                                .then(doc=>{
                                    // success right here
                                    return res.status(201).json({
                                        status: "success",
                                        message: "user successfully added."
                                    })
                                })
                                .catch(err=>{
                                    return res.status(400).json({
                                        status: "failed",
                                        error: err
                                    })
                                })
                            })
                            .catch(err => {
                                return res.status(400).json({
                                    status: "failed",
                                    error: err
                                })
                            })
                        }
                    })
                }
            })
            .catch()
        })
    }else{
        // if there is an invalid role in the request
        return res.status(400).json({
            status: "failed",
            error: "not proper role"
        })
    }
}

exports.deleteUser = (req, res, next) => {
    // make sure the user is an admin
    if(req.user.role == 'admins'){
        User.findByIdAndDelete(req.params.id)
        .exec()
        .then(user => {
            if(user){
                //console.log(user)
                Company.findOne({MC : req.user.companyID})
                .exec()
                .then(comp => {
                    if (comp){
                        // in the company we update the array with the deleted users role and remove their id
                        comp[user.role] = comp[user.role].filter(item=>{
                            return item._id != req.params.id;
                        });
                        // save the modified company with the changed array
                        comp
                        .save()
                        .then(_ => {
                            res.status(200).json({
                                status:"success",
                                message: "successfully removed user"
                            })
                        })
                        .catch(err => {
                            res.status(400).json({
                                status: "failed",
                                message: "idk"
                            })
                        })

                    }else{
                        res.status(404).json({
                            status: "failed",
                            message: "No company found"
                        })
                    }
                })
                .catch(err => {
                    //console.log('error in company search')
                    res.status(400).json({
                        status: "failed",
                        error: err
                    })
                })
            }else{
                res.status(404).json({
                    status : "failed",
                    message: "User does not exist in your company"
                })
            }
        })
        .catch(err=> {
            //console.log('error in user search')
            res.status(400).json({
                status: "failed",
                error: err
            })
        })
    }else{
        res.status(400).json({
            status: "failed",
            message: "not authorized to perform this action."
        })
    }
}