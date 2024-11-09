const { Router } = require('express');
const { validateZodSchema } = require('../../middlewares/index');
const { RegisterSchema, LoginSchema } = require('./zodSchemas');
const register = require('./register');

const router = Router();

router.post('/register', validateZodSchema(RegisterSchema), register);
router.post('/login', validateZodSchema(LoginSchema), register);

module.exports = router;