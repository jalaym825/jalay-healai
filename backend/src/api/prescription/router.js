const Router = require("express")
const createPrescription = require('./createPrescription')
const { verifyJWT } = require('../../middlewares/index')
const router = Router();

router.post('createPrescription', verifyJWT, createPrescription);

module.exports = router;