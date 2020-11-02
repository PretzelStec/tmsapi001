const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// require the authenticator
const authenticateToken = require('../authenticator');

// instantiate the router
const router = express.Router();

// get user model
const Company = require('../models/Company');
const User = mongoose.model('user', require('../schemas/User'));
const Load = require('../models/Load');

router.get('/', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "return all loads"
    })
})

router.get('/:id', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "return load"
    })
})

router.post('/add/drop', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "added new drop"
    })
})

router.post('/add/pickup', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "added new pickup"
    })
})

router.delete('/remove/drop/:id', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "removed drop"
    })
})

router.delete('/remove/pickup/:id', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "removed pickup"
    })
})

router.post('/add/driver', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "driver added"
    })
})

router.delete('/remove/driver', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "driver removed"
    })
})

router.post('/add/dispatch', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "dispatch added"
    })
})

router.delete('/remove/dispatch', authenticateToken, (req, res, next) => {
    res.status(200).json({
        message : "dispatch removed"
    })
})

module.exports = router