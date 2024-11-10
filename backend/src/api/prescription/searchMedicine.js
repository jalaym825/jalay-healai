const expressAsyncHandler = require("express-async-handler");
const {Prisma: prisma} = require('../../utils/index');

const searchMedicine = expressAsyncHandler(async (req, res, next) => {
    const { query, page, type } = req.query
    const limit = 10
    const offset = (page - 1) * limit

    // Build where clause
    const whereClause = {
        AND: [
            {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            // Add type filter if provided
            ...(type ? [{
                type: {
                    equals: type,
                    mode: 'insensitive'
                }
            }] : [])
        ]
    }

    // Get results and total count in parallel
    const [medicines, totalCount] = await Promise.all([
        prisma.medicine.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                price: true,
                type: true,
                // Include count of prescriptions if needed
                _count: {
                    select: {
                        Prescription_Medicine: true
                    }
                }
            },
            take: limit,
            // skip: offset,
            orderBy: {
                name: 'asc'
            }
        }),
        prisma.medicine.count({
            where: whereClause
        })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    res.json({
        results: medicines.map(medicine => ({
            ...medicine,
            prescriptionCount: medicine._count.Prescription_Medicine
        })),
        pagination: {
            currentPage: page,
            totalPages,
            totalResults: totalCount,
            hasMore: page < totalPages,
            limit
        }
    })
})

module.exports = searchMedicine;