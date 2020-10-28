const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// instantiate the router
const router = express.Router();

// get user model
const Company = require('../models/Company');



router.post('./user/register')

