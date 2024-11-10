const { Router } = require('express');
const { validateZodSchema } = require('../../middlewares');
const { ForumSchema, PostMessageSchema } = require('./zodSchemas')
const createForum = require('./createForum');
const postForumMessage = require('./postForumMessage');
const { verifyJWT } = require('../../middlewares/index')
const getForum = require('./getForum');
const getForums = require('./getForums');
const router = Router();

router.post("/createForum", verifyJWT, validateZodSchema(ForumSchema), createForum)
router.get("/:id", getForum)
router.post('/postMessage', verifyJWT, validateZodSchema(PostMessageSchema), postForumMessage)
router.get('/', getForums)
// router.get('/getAppointment', verifyJWT, getAppointment)

module.exports = router;