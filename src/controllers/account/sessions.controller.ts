import { logoutDeviceBySessionId } from '@/services/device.service';
import { logoutSessionById } from '@/services/session.service';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const logoutSessionController = async (req: Request, res: Response): Promise<void> => {
    try{
        if (!isAuthenticatedRequest(req)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const sessionId = req.params.id;
        await Promise.all([
            logoutSessionById(sessionId),
            logoutDeviceBySessionId(sessionId)
        ]);
        // should ban access token with redis or something simillar
        res.json({ status: 'OK' });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('account logout session controller error', err);
    }
};
