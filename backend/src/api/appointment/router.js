const { Rotuer, Router } = require('express');
const { validateZodSchema } = require('../../middlewares');
const { AppointmentSchema } = require('./zodSchemas')
const createAppointment = require('./createAppointment');
const getAppointment = require("./getAppointment")
const getToken = require('./getToken')
const { verifyJWT } = require('../../middlewares/index')

const router = Router();

router.post("/createAppointment", verifyJWT, validateZodSchema(AppointmentSchema), createAppointment)
router.get('/getAppointment', verifyJWT, getAppointment)
router.post('/getToken', verifyJWT, getToken)

module.exports = router;