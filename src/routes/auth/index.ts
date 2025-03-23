import { Router } from 'express';
import { validateLoginInput } from '@/middlewares/validators/login';
import { validateRegisterInput } from '@/middlewares/validators/register';
import { register } from '@/controllers/auth/register.controller';
import { refresh } from '@/controllers/auth/refresh.controller';
import { login } from '@/controllers/auth/login.controller';
import { logout } from '@/controllers/auth/logout.controller';

const router = Router();

router.post('/login', validateLoginInput, login);
router.post('/logout', logout);
router.post('/register', validateRegisterInput, register);
router.post('/refresh', refresh);

export default router;
