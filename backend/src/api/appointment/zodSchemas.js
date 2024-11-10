const { z } = require("zod");

const AppointmentSchema = z.object({
    hosted_by: z.string().email({ message: "Invalid host email" }),
    attended_by: z.string().email({ message: "Invalid attendee email" }),
    time: z.string()
});

module.exports = { AppointmentSchema }