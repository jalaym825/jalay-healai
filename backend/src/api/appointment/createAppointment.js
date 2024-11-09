const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Prisma } = require("../../utils/index");


const createAppointment = asyncHandler(async (req, res, next) => {
    const {
        hosted_by,
        attended_by,
        time
    } = req.body;

    if (!hosted_by || !attended_by || !time) {
        return next({ path: '/appointment/createAppointment', statusCode: 400, message: "Validation error!" });
    }

    const date = new Date(time);
    const isValid = date < Date.now();

    if (!isValid) {
        return next({
            path: '/appointment/createAppointment', statusCode: 400, message: "Invalid date and time!"
        })
    }


    if (hosted_by == attended_by) {
        return next({
            path: '/appointment/createAppointment', statusCode: 400, message: "Hosted user and Attendee user cannot be same!"
        })
    }

    const hosted_user = await Prisma.users.findFirst({
        where: {
            email: hosted_by
        }
    })

    if (!hosted_user) {
        return next({ path: '/appointment/createAppointment', statusCode: 404, message: "Hosted user is not found!" })
    }

    const attendee_user = await Prisma.users.findFirst({
        where: {
            email: attended_by
        }
    })

    if (!attendee_user) {
        return next({ path: '/appointment/createAppointment', statusCode: 404, message: "Attendee user is not found!" })
    }


    await Prisma.appointment.create({
        data: {
            hosted_by,
            attended_by,
            time
        }
    })

    return res.status(201).json({
        message: "Appointment Schedule Successfully!"
    })

})

module.exports = createAppointment;