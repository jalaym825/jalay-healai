const asyncHandler = require("express-async-handler")
const { Prisma } = require("../../utils");

const getPrescription = asyncHandler(async (req, res, next) => {
    const user = req.user;

    const prescriptionData = await Prisma.prescription.findMany({
        where: {
            patient_id: user.email
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 1,
        include: {
            Prescription_Medicine: {
                include: {
                    medicine: true
                }
            }
        }
    });

    return res.status(200).json({
        message: "Prescription data fetched successfully!",
        data: prescriptionData
    })

})

module.exports = getPrescription;