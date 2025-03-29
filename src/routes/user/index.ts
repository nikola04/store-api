import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { userById } from '@/controllers/user/byid.controller';
import meRoute from './me';

const router = Router();

router.use(authenticate());

router.use('/@me', meRoute);
router.get('/:id', userById);

export default router;
