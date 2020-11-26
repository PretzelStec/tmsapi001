const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const customerController = require('../controllers/customerController');

router.get('/', authenticateToken, customerController.getAllCustomers);

router.get('/:id', authenticateToken, customerController.getCustomerDetails);

router.post('/', authenticateToken, customerController.postCustomer);

router.patch('/:id', authenticateToken, customerController.editCustomer);

router.delete('/:id', authenticateToken, customerController.deleteCustomer);

module.exports = router;
