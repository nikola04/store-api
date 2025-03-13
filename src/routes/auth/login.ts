import { login } from '@/controllers/auth/login';
import { Router } from 'express';

const router = Router();

router.use('/', login);

export default router;
