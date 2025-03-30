import { Router } from 'express';
import { currentUserController } from '@/controllers/user/current.controller';
import { userDevicesController } from '@/controllers/user/devices.controller';
import { userActivitiesController, userActivityByIdController } from '@/controllers/user/activities.controller';
import { validateObjectIdParam } from '@/middlewares/validators/objectIdParam';

const router = Router();

router.get('/', currentUserController);
router.get('/devices', userDevicesController);
router.get('/activities', userActivitiesController);
router.get('/activities/:id', validateObjectIdParam, userActivityByIdController);

export default router;
