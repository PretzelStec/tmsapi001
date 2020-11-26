const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const truckController = require('../controllers/truckController');

//GET ALL
router.get('/', authenticateToken, truckController.getAllTrucks);

// GET BY LP
router.get('/:lp',authenticateToken, truckController.getTruckDetails);

// Routes to post new trucks
router.post('/', authenticateToken, truckController.postTruck);

// TODO: add edit route
module.exports = router;

