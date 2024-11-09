const { Router } = require('express');
const { validateZodSchema } = require('../../middlewares/index');
const { RegisterSchema, LoginSchema } = require('./zodSchemas');
const register = require('./register');
const login  = require('./login')
const continueWithGoogle = require('./continueWithGoogle')
const googleCallBack = require('./googleCallBack')

const router = Router();

router.post('/register', validateZodSchema(RegisterSchema), register);
router.post('/login', validateZodSchema(LoginSchema), login);

router.get('/google', continueWithGoogle);
router.get('/google/callback', googleCallBack);

module.exports = router;