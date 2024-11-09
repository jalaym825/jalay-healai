const { Router } = require('express');
// import { validateZodSchema } from '../../middlewares/index';
// import { registerSchema } from '../../utils/zodValidators';
const register = require('./register');

const router = Router();

router.post('/register', register);

module.exports = router;