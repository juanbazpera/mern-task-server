const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controller/userController');

//Create user
// api/users
router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check(
      'password',
      'El password debe tener un minimo de 6 caracteres'
    ).isLength({ min: 6 }),
  ],
  userController.createUser
);

module.exports = router;
