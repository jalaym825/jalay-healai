const { Rotuer, Router } = require('express');
const { validateZodSchema } = require('../../middlewares');
const { AppointmentSchema } = require('./zodSchemas')
const createAppointment = require('./createAppointment');
const getAppointment = require("./getAppointment")
const { verifyJWT } = require('../../middlewares/index')

const router = Router();

router.post("/createAppointment", verifyJWT, validateZodSchema(AppointmentSchema), createAppointment)
router.get('/getAppointment', verifyJWT, getAppointment)

module.exports = router;