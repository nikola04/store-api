import { Router } from 'express';
import { authenticate } from '@/middlewares/authenticate';
import { currentUser } from '@/controllers/user/current.controller';
import { userById } from '@/controllers/user/byid.controller';
import { devicesByUserId } from '@/controllers/user/devices.controller';

const router = Router();

router.use(authenticate());

router.get('/@me', currentUser);
router.get('/@me/devices', devicesByUserId);
router.get('/:id', userById);

export default router;
