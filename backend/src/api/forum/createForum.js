const expressAsyncHandler = require("express-async-handler");
const {Prisma:prisma} = require('../../utils/index')
const createForum = expressAsyncHandler(async (req, res, next) => {
    const {message} = req.body;

    const forum = await prisma.forum.create({
        data: {
            original_message: {
                create: {
                    message,
                    user_id: req.user.email,
                }
            }
        }
    })

    res.status(201).json(forum)
})

module.exports = createForum;