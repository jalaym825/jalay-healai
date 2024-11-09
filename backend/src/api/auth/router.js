import { Router } from 'express';
import { validateZodSchema } from '../../middlewares/index';
import { registerSchema } from '../../utils/zodValidators';
import register from './register';

const router = Router();

router.post('/register', validateZodSchema(registerSchema), register);

export default router;