import { Session } from '@/models/session.types';
import { getDevicesByIds } from '@/services/device.service';
import { getSessionsByUserId } from '@/services/session.service';
import { decodeFingerprintJWT } from '@/utils/fingerprint';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const devicesByUserId = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const fingerprint = decodeFingerprintJWT(req.cookies.fingerprint);
        const sessions = await getSessionsByUserId(req.user.id);
        const devicesIds: string[] = [];
        sessions.forEach(session => {
            const id = session.device_id.toString();
            if(!devicesIds.includes(id)) devicesIds.push(id);
        });
        const devices = await getDevicesByIds(devicesIds);
        const formated = devices.map(device => {
            const lastSession = getLastSession(sessions, device._id.toString());
            return ({
                id: device._id,
                name: device.name,
                type: device.type,
                os: device.os,
                app: device.app,
                logged_out: lastSession?.logged_out ?? true,
                current_device: fingerprint === device.fingerprint,
                last_login: lastSession?.login_date || null
            });
        });
        res.json({ status: 'OK', devices: formated });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('user logins controller error', err);
    }
};

const getLastSession = (sessions: Session[], deviceId: string): Session|null => {
    let last_session: Session|null = null;
    sessions.forEach(s => {
        if(s.device_id.toString() !== deviceId) return;
        if(!last_session || last_session.login_date < s.login_date) last_session = s;
    });
    return last_session;
};
