const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const authenticateToken = require('../authenticator');

const Customer = require('../models/Customer');

router.get('/', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message: "get all"
    })
})
