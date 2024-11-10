const { Router } = require('express');
const { validateZodSchema } = require('../../middlewares');
const { AppointmentSchema } = require('./zodSchemas')
const createAppointment = require('./createAppointment');
const getAppointment = require("./getAppointment")
const getToken = require('./getToken')
const { verifyJWT } = require('../../middlewares/index');
const getAvailableDoctors = require('./getAvailableDoctors');

const router = Router();

router.post("/createAppointment", verifyJWT, validateZodSchema(AppointmentSchema), createAppointment)
router.get('/getAppointment', verifyJWT, getAppointment)
router.post('/getToken', verifyJWT, getToken)
router.get('/getAvailableDoctors', getAvailableDoctors)

module.exports = router;
