import { Router } from 'express';
import { userByIdController } from '@/controllers/user/user.controller';
import meRoute from './me';

const router = Router();

router.use('/@me', meRoute);

// GET /user/[id]
router.get('/:id', userByIdController);

export default router;
