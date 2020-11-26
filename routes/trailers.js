const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const trailerController = require('../controllers/trailerController');

router.get('/', authenticateToken, trailerController.getAllTrailers);

router.get('/:lp',authenticateToken, trailerController.getTrailerDetails);

router.post('/', authenticateToken, trailerController.postTrailer);

module.exports = router;