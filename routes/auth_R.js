const express = require('express')
const router = express.Router()

const {register, login, logout} = require('../controllers/auth_C')

router.post('/logn', login)
router.post('/register', register)
router.post('/logout', logout)

module.exports = router