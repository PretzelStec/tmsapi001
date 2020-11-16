const mongoose = require('mongoose');

const stringReqType = {
    type : String,
    required: true
};

const Customer = mongoose.Schema({

    company: stringReqType,
    dot: stringReqType,
    mc: stringReqType,
    ssn: stringReqType,
    scac: stringReqType,
    status: stringReqType,
    contact: stringReqType,
    email: stringReqType,
    phone: stringReqType,

    //mailing
    mailingBillTo: stringReqType,
    mailingAttentionTo: stringReqType,
    mailingStreet: stringReqType,
    mailingCity: stringReqType,
    mailingState: stringReqType,
    mailingZip: stringReqType,

    //Physical
    physicalBillTo: stringReqType,
    physicalAttentionTo: stringReqType,
    physicalStreet: stringReqType,
    physicalCity: stringReqType,
    physicalState: stringReqType,
    physicalZip: stringReqType,

    postedByMC: stringReqType,

    comments: String
})

module.exports = mongoose.model('customer', Customer);