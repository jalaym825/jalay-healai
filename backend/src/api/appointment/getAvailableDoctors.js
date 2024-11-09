const asyncHandler = require('express-async-handler');
const { Prisma: prisma } = require('../../utils/index');

function roundToNext15Minutes(date) {
    const minutes = date.getMinutes();
    const remainder = minutes % 15;
    const roundedMinutes = remainder === 0 ? minutes : minutes + (15 - remainder);
    const newDate = new Date(date);
    newDate.setMinutes(roundedMinutes, 0, 0);
    return newDate;
}

// Helper function to get all time slots for the rest of the day
function getTimeSlots(startTime) {
    const timeSlots = [];
    const endOfDay = new Date(startTime);
    endOfDay.setHours(23, 59, 59, 999);

    let currentSlot = roundToNext15Minutes(startTime);

    while (currentSlot <= endOfDay) {
        timeSlots.push(new Date(currentSlot));
        currentSlot.setMinutes(currentSlot.getMinutes() + 15);
    }

    return timeSlots;
}

const getAvailableDoctors = asyncHandler(async (req, res, next) => {
    const { specialty } = req.query;
    const currentTime = new Date();
    const timeSlots = getTimeSlots(currentTime);

    const docs = [];

    for (const timeSlot of timeSlots) {
        console.log('Checking for time slot:', timeSlot);
        // Get busy doctors at this time slot
        const busyDoctors = await prisma.appointment.findMany({
            where: {
                time: timeSlot,
                status: {
                    not: 'CANCELLED'
                }
            },
            select: {
                hosted_by: true
            }
        });

        const busyDoctorEmails = busyDoctors.map(doc => doc.hosted_by).filter(Boolean);

        // Get first available doctor
        const whereClause = {
            role: 'DOCTOR',
            // isVerified: true,
            email: {
                notIn: busyDoctorEmails
            }
        };

        if (specialty) {
            whereClause.specialty = specialty;
        }

        const availableDoctors = await prisma.users.findMany({
            where: whereClause,
            select: {
                email: true,
                firstName: true,
                lastName: true,
                gender: true,
                mobileNumber: true,
                age: true,
                createdAt: true,
                _count: {
                    select: {
                        hosted_appointments: true,
                        PrescriptionDoctor: true
                    }
                }
            },
            take: 3
        });

        if (availableDoctors) {
            // Format the doctor data
            availableDoctors.map(availableDoctor => {
                return {
                    email: availableDoctor.email,
                    fullName: `${availableDoctor.firstName} ${availableDoctor.lastName || ''}`.trim(),
                    gender: availableDoctor.gender,
                    age: availableDoctor.age,
                    mobileNumber: availableDoctor.mobileNumber,
                    experience: {
                        joinedDate: availableDoctor.createdAt,
                        appointmentsConducted: availableDoctor._count.hosted_appointments,
                        prescriptionsWritten: availableDoctor._count.PrescriptionDoctor
                    }
                }
            })

            docs.push(...availableDoctors);
            if(docs.length >= 3) {
                return res.json({
                    success: true,
                    data: {
                        currentTime: currentTime.toLocaleString(),
                        nextAvailableTime: timeSlot.toLocaleString(),
                        availableDoctors: docs
                    }
                });
            }
        }
    }

    // If no availability found
    return res.json({
        success: false,
        error: 'No available doctors found for today',
        code: 'NO_AVAILABILITY',
        data: {
            currentTime: currentTime
        }
    });
})

module.exports = getAvailableDoctors;