const asyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils/index");

function generateSixCharString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

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
    const meeting_id = generateSixCharString();

    if (!isValid) {
        return next({
            path: '/appointment/createAppointment', statusCode: 400, message: "Invalid date and time!"
        });
    }

    if (hosted_by === attended_by) {
        return next({
            path: '/appointment/createAppointment', statusCode: 400, message: "Hosted user and Attendee user cannot be the same!"
        });
    }

    const hosted_user = await Prisma.users.findFirst({
        where: { email: hosted_by }
    });

    if (!hosted_user) {
        return next({ path: '/appointment/createAppointment', statusCode: 404, message: "Hosted user not found!" });
    }

    const attendee_user = await Prisma.users.findFirst({
        where: { email: attended_by }
    });

    if (!attendee_user) {
        return next({ path: '/appointment/createAppointment', statusCode: 404, message: "Attendee user not found!" });
    }

    await Prisma.appointment.create({
        data: {
            time,
            appointment_link: meeting_id,
            hosted_by_user: { connect: { id: hosted_user.id } },
            attended_by_user: { connect: { id: attendee_user.id } }
        }
    });

    return res.status(201).json({
        message: "Appointment Scheduled Successfully!",
        meeting_id
    });
});

module.exports = createAppointment;
