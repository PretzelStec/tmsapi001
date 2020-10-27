const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Data = require('../models/Data');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Data.find()
    .exec()
    .then(data => {
        res.status(200).json({
            message : "success",
            data : data
        })
    })
    .catch();
})