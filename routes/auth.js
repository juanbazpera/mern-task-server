// route to user auth

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controller/authController');
const auth = require('../middleware/auth');

//Create user
// api/auth
router.post('/', authController.userAuth);

// Get auth user
router.get('/', auth, authController.getUserAuth);

module.exports = router;
