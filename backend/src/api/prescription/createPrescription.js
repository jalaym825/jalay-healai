const expressAsyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils");

const createPrescription = expressAsyncHandler(async (req, res, next) => {

    const {
        prescription_medicine,
        appointment_id
    } = req.body;

    if (!prescription_medicine || !appointment_id) {
        return next({
            path: '/prescription/createPrescription', statusCode: 400, message: "Validation failed!"
        })
    }

    const appointment = await Prisma.appointment.findFirst({
        where: {
            id: appointment_id
        }
    })

    const patient_id = appointment.attended_by;
    const doctor_id = appointment.hosted_by;

    const prescriptionData = await Prisma.prescription.create({
        data: {
            patient_id,
            doctor_id,
            appointment_id
        }
    })

    console.log(prescriptionData)

    for (const medicine of prescription_medicine) {
        await Prisma.prescription_Medicine.create({
            data: {
                prescription_id: prescriptionData.id,
                medicine_id: parseInt(medicine.medicine_id),
                time: medicine.time,
                quantity: parseInt(medicine.quantity),
                eat_time: medicine.eat_time
            }
        })
    };

    return res.status(201).json({
        message: "Prescription Generated Successfully!"
    })

})

module.exports = createPrescription;