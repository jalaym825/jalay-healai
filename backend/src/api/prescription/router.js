const { Router } = require("express")
const createPrescription = require('./createPrescription')
const { verifyJWT } = require('../../middlewares/index');
const searchMedicine = require("./searchMedicine");
const router = Router();

router.post('/createPrescription', verifyJWT, createPrescription);
router.get('/search', verifyJWT, searchMedicine);

module.exports = router;