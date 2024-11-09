const expressAsyncHandler = require("express-async-handler");
const {Prisma:prisma} = require('../../utils/index')

const getForums = expressAsyncHandler(async(req, res, next) => {
    const forums = await prisma.forum.findMany({
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            original_message: true
        }
    })
    res.json({forums})
})

module.exports = getForums;