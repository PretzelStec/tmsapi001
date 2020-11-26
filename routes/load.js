const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const loadController = require('../controllers/loadControllers');


router.get('/', authenticateToken, loadController.getAllLoads );

router.get('/myloads', authenticateToken, loadController.getMyLoads)

router.get('/:id', authenticateToken, loadController.getLoadDetails );

router.post('/', authenticateToken, loadController.postLoad );

router.patch('/:id', authenticateToken, loadController.editLoad );

router.delete("/:id", authenticateToken, loadController.deleteLoad );

module.exports = router