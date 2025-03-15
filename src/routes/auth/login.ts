import { login } from '@/controllers/auth/login';
import { validateLoginInput } from '@/middlewares/validators/login';
import { Router } from 'express';

const router = Router();

router.post('/', validateLoginInput, login);

export default router;
