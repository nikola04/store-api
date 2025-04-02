import { Router } from 'express';
import securityRoute from './security';
import { accountActivitiesController, accountActivityByIdController, approveActivityController } from '@/controllers/account/activities.controller';
import { accountDevicesController, accountDeviceByIdController } from '@/controllers/account/devices.controller';
import { logoutSessionController } from '@/controllers/account/sessions.controller';
import { validateObjectIdParam } from '@/middlewares/validators/objectIdParam';

const router = Router();

router.use('/security', securityRoute);

// GET /account/devices
router.get('/devices', accountDevicesController);
router.get('/devices/:id', validateObjectIdParam, accountDeviceByIdController);

// GET /account/activities
router.get('/activities', accountActivitiesController);
router.get('/activities/:id', validateObjectIdParam, accountActivityByIdController);
/// PATCH
router.patch('/activities/:id', validateObjectIdParam, approveActivityController);

// DELETE /account/sessions
router.delete('/sessions/:id', validateObjectIdParam, logoutSessionController);

export default router;
