import { Router } from 'express';
import { userDeviceByIdController, userDevicesController } from '@/controllers/user/devices.controller';
import { approveActivityController, userActivitiesController, userActivityByIdController } from '@/controllers/user/activities.controller';
import { validateObjectIdParam } from '@/middlewares/validators/objectIdParam';
import { currentUserController } from '@/controllers/user/user.controller';
import { logoutSessionController } from '@/controllers/user/sessions.controller';

const router = Router();

// GET /user/@me
router.get('/', currentUserController);

// GET /user/@me/devices
router.get('/devices', userDevicesController);
router.get('/devices/:id', validateObjectIdParam, userDeviceByIdController);

// GET /user/@me/activities
router.get('/activities', userActivitiesController);
router.get('/activities/:id', validateObjectIdParam, userActivityByIdController);
/// PATCH
router.patch('/activities/:id', validateObjectIdParam, approveActivityController);

// DELETE /user/@me/sessions
router.delete('/sessions/:id', validateObjectIdParam, logoutSessionController);

// PATCH /user/@me/password
router.patch('/password');
// POST
router.post('/password/verify');

export default router;
