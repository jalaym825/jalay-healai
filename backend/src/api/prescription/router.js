const { Router } = require("express")
const createPrescription = require('./createPrescription')
const getPrescription = require('./getPrescription')
const { verifyJWT } = require('../../middlewares/index');
const searchMedicine = require("./searchMedicine");
const router = Router();

router.post('/createPrescription', verifyJWT, createPrescription);
router.get('/search', verifyJWT, searchMedicine);
router.get('/getPrescription', verifyJWT, getPrescription)

module.exports = router;