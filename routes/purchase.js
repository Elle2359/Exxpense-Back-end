const express = require('express');

const purchaseController = require('../controllers/purchase');

const authentication=require('../middleware/auth');

const router = express.Router();

router.get('/premiummembership', authentication.authenticate,purchaseController.purchasepremeium);

router.post('/updatetransaction', authentication.authenticate, purchaseController.updateTransaction);

module.exports = router;  