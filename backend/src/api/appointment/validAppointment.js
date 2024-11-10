const expressAsyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils");

const validAppointment = expressAsyncHandler(async (req, res, next) => {
    const { meetingId } = req.body;

    if (!meetingId) {
        return next({
            path: '/appointment/validAppointment', statusCode: 400, message: "Meetingid is required!"
        })
    }

    const meetingData = await Prisma.appointment.findFirst({
        where: {
            appointment_link: meetingId
        }
    })

    if (!meetingData) {
        return next({
            path: '/appointment/validAppointment', statusCode: 404, message: "Meetingid is not found!"
        })
    }

    return res.status(200).json({
        message: "Meeting validate successfully!"
    })
})

module.exports = validAppointment;