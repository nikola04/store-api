import { Router } from 'express';
import { validateLoginInput } from '@/middlewares/validators/login';
import { validateRegisterInput } from '@/middlewares/validators/register';
import { register } from '@/controllers/auth/register.controller';
import { refresh } from '@/controllers/auth/refresh.controller';
import { logout } from '@/controllers/auth/logout.controller';
import { checkEmailController } from '@/controllers/auth/checkEmail.controller';
import { loginPasskeyController, loginPasswordController } from '@/controllers/auth/login.controller';

const router = Router();

router.post('/check-email', checkEmailController);
router.post('/login/password', validateLoginInput, loginPasswordController);
router.post('/login/passkey', loginPasskeyController);
router.post('/logout', logout);
router.post('/register', validateRegisterInput, register);
router.post('/refresh', refresh);

export default router;
