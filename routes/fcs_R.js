const express = require('express');
const router = express.Router()

const {createFCS} = require('../controllers/fcs_C')

router.post('/fees', createFCS)

module.exports = router