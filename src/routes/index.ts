import { Router } from 'express';
import authRoute from './auth';
import userRoute from './user';
import accountRoute from './account';
import { authenticate } from '@/middlewares/authenticate';

const router = Router();

router.use('/auth', authRoute);
router.use('/user', authenticate(), userRoute);
router.use('/account', authenticate(), accountRoute);

export default router;
