import { refresh } from '@/controllers/auth/refresh';
import { Router } from 'express';

const router = Router();

router.post('/', refresh);

export default router;
