const express = require('express');
const LoginController = require('../controllers/LoginController')

const router = express.Router()

router.get('/login', LoginController.login)
router.get('/register', LoginController.register)
router.get('/logout', LoginController.logout);

router.post('/register', LoginController.storeUser)
router.post('/login', LoginController.auth)

module.exports = router