const { Router } = require('express')
const Payment = require('./razorpay')
const updateSubscription = require('./updateSubscription');
const { verifyJWT } = require('../../middlewares');

const router = Router();

router.post('/payment', Payment);
router.post('/updateSubscription', verifyJWT, updateSubscription)

module.exports = router;    