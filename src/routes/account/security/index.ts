import { getPasskeysController, startPasskeyRegistrationController, verifyPasskeyRegistrationController } from '@/controllers/account/security/passkeys.controller';
import { getSecurityDataController } from '@/controllers/account/security/security.controller';
import { validateAttestation } from '@/middlewares/validators/passkeyRegister';
import { Router } from 'express';

const router = Router();

// GET /account/security/
router.get('/', getSecurityDataController);
// GET /account/security/passkeys/
router.get('/passkeys', getPasskeysController);
// POST
router.post('/passkeys/start', startPasskeyRegistrationController);
router.post('/passkeys/verify', validateAttestation, verifyPasskeyRegistrationController);

// PATCH /account/security/password
router.patch('/password');
// POST
router.post('/password/verify');

export default router;
