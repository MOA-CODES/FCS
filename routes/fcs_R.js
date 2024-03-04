const express = require('express');
const router = express.Router()

const {createFCS, TransactionFee} = require('../controllers/fcs_C')

router.post('/fees', createFCS)
router.post('/compute-transaction-fee', TransactionFee)

module.exports = router