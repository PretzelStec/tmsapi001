const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const companyController = require('../controllers/companyController');

router.get('/', authenticateToken, companyController.getCompanyData);

router.get('/admins', authenticateToken, companyController.getAdmins);

router.get('/drivers', authenticateToken, companyController.getDrivers);

router.get('/dispatchers', authenticateToken, companyController.getDispatchers);

router.get('/accountants', authenticateToken, companyController.getAccountants);

router.post('/register', authenticateToken, companyController.register);
//delete a user from your company
router.delete('/user/:id', authenticateToken, companyController.deleteUser);

module.exports = router;

// register new users under a company
/*

{
    "fname":"",
    "lname":"",
    "phone":"",
    "email":"",
    "password":"",
    "city":"",
    "state":"",
    "zip":"",
    "role": <"admins", "drivers", "accountants", "dispatchers">
}

*/