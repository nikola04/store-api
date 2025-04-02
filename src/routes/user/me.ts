import { Router } from 'express';
import { currentUserController } from '@/controllers/user/user.controller';

const router = Router();

// GET /user/@me
router.get('/', currentUserController);

export default router;
