const express = require('express');
const router = express.Router()

const {createFCS, TransactionFee, getAllFcs} = require('../controllers/fcs_C')

router.route('/fees').post(createFCS).get(getAllFcs)
router.post('/compute-transaction-fee', TransactionFee)

module.exports = router