import { Router } from 'express';
import { currentUserController } from '@/controllers/user/current.controller';
import { userDevicesController } from '@/controllers/user/devices.controller';
import { userActivitiesController } from '@/controllers/user/activities.controller';

const router = Router();

router.get('/', currentUserController);
router.get('/devices', userDevicesController);
router.get('/activities', userActivitiesController);

export default router;
