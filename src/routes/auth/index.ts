import { Router } from 'express';
import loginRoute from './login';
import registerRoute from './register';
import refreshRoute from './refresh';

const router = Router();

router.use('/login', loginRoute);
router.use('/register', registerRoute);
router.use('/refresh', refreshRoute);

export default router;
