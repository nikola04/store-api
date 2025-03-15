import { register } from '@/controllers/auth/register';
import { validateRegisterInput } from '@/middlewares/validators/register';
import { Router } from 'express';

const router = Router();

router.post('/', validateRegisterInput, register);

export default router;
