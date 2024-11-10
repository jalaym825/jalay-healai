const {z} = require('zod');

const ForumSchema = z.object({
    message: z.string().min(1).max(255),
})

const PostMessageSchema = z.object({
    message: z.string().min(1).max(255),
    forum_id: z.number()
})

module.exports = { ForumSchema, PostMessageSchema }