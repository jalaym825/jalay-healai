const expressAsyncHandler = require("express-async-handler");
const { Prisma: prisma } = require('../../utils/index')

const getForum = expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const forum = await prisma.forum.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            original_message: {
                include: {
                    user: true
                }
            },
            forum_messages: {
                include: {
                    user: true
                }
            }
        }
    })

    res.status(200).json(forum)
})

module.exports = getForum;