const express = require('express');
const router = express.Router();

const authenticateToken = require('../authenticator');

const userController = require('../controllers/userController');

router.get('/', authenticateToken, userController.getMyInfo);

router.post('/login', userController.login);
// TODO: convert to use form data for support with images
router.post('/register', userController.register);

// get info of a user given the id
router.get('/:id', userController.getUserDetails);

router.patch('/edit/password', authenticateToken, userController.updatePassword);

router.patch('/edit/truck', authenticateToken, userController.updateTruck)

module.exports = router;

/* 

"user": {
    "fname":"",
    "lname":"",
    "phone":"",
    "email":"",
    "password":"",
    "city":"",
    "state":"",
    "zip":""
},
"company": {
    "MC":"",
    "name":"",
    "state":"",
    "city":"",
    "street":"",
    "street2":"",
    "zipCode":"",
    "officePhone":"" 
}
*/

/* 
{
    "email":"",
    "password":""
}
*/

/* 
New password

{
    "password":"",
    "newPassword":""
}
*/