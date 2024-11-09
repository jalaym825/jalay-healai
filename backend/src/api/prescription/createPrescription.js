const expressAsyncHandler = require("express-async-handler");
const { Prisma } = require("../../utils");

const createPrescription = expressAsyncHandler(async (req, res, next) => {

    const {
        patient_id,
        doctor_id,
        prescription_medicine,
        appointment_id
    } = req.body;

    if (!patient_id || !doctor_id || !prescription_medicine || !appointment_id) {
        return next({
            path: '/prescription/createPrescription', statusCode: 400, message: "Validation failed!"
        })
    }

    const doctor = await Prisma.users.findFirst({
        where: {
            email: doctor_id
        }
    })

    if (!doctor) {
        return next({
            path: '/prescription/createPrescription', statusCode: 404, message: "Doctor not found!"
        })
    }

    const patient = await Prisma.users.findFirst({
        where: {
            email: patient_id
        }
    })

    if (!patient) {
        return next({
            path: '/prescription/createPrescription', statusCode: 404, message: "Patient not found!"
        })
    }

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
                medicine_id: medicine.medicine_id,
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