const expressAsyncHandler = require("express-async-handler");
const { Prisma: prisma } = require('../../utils/index');


const postForumMessage = expressAsyncHandler(async (req, res, next) => {
    const { message, forum_id } = req.body;

    const forum = await prisma.forum.findUnique({
        where: {
            id: forum_id
        }
    })

    if (!forum) {
        res.status(404)
        throw new Error('Forum not found')
    }

    const forumMessage = await prisma.forumMessage.create({
        data: {
            message,
            user_id: req.user.email,
            forum_id
        },
        include: {
            user: true
        }
    })

    res.status(201).json(forumMessage)
})

module.exports = postForumMessage;