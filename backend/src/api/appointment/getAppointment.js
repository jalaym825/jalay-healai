const asyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils");

const getAppointment = asyncHandler(async (req, res, next) => {
    const {
        status
    } = req.query;

    const user = req.user;

    if (!status) {
        return next({
            path: '/appointment/getAppointment', statusCode: 400, message: "Status required in query parameters!"
        })
    }

    // Current date and time
    const currentDateTime = new Date();


    if (status === "upcoming") {
        if (user.role == "PATIENT") {
            const appointmentData = await Prisma.appointment.findMany({
                where: {
                    attended_by: user.email,
                    time: {
                        gt: currentDateTime, // Upcoming appointments
                    }
                },
                include: {
                    Prescription: true,
                    hosted_by_user: true
                }
            })

            return res.status(200).json({
                message: "Patient appointments data fetched successfully!",
                data: appointmentData
            })
        }

        if (user.role == "DOCTOR") {
            const appointmentData = await Prisma.appointment.findMany({
                where: {
                    hosted_by: user.email,
                    time: {
                        gt: currentDateTime, // Upcoming appointments
                    }
                },
                include: {
                    Prescription: true,
                    hosted_by_user: true
                }
            })

            return res.status(200).json({
                message: "Doctor appointments data fetched successfully!",
                data: appointmentData
            })
        }
    }


    if (status === "past") {
        console.log(user.role)
        if (user.role === "PATIENT") {
            const appointmentData = await Prisma.appointment.findMany({
                where: {
                    attended_by: user.email,
                    time: {
                        lt: new Date(), // Past appointments
                    },
                },
                include: {
                    Prescription: true,
                    hosted_by_user: true
                }
            });

            return res.status(200).json({
                message: "Patient past appointments data fetched successfully!",
                data: appointmentData,
            });
        }

        if (user.role === "DOCTOR") {
            const appointmentData = await Prisma.appointment.findMany({
                where: {
                    hosted_by: user.email,
                    time: {
                        lt: currentDateTime, // Past appointments
                    },
                },
                include: {
                    Prescription: true,
                    hosted_by_user: true
                }
            });

            return res.status(200).json({
                message: "Doctor past appointments data fetched successfully!",
                data: appointmentData,
            });
        }
    }

})

module.exports = getAppointment