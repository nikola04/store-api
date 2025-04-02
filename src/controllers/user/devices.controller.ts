import { ISession } from '@/models/session.types';
import { DeviceError, getDeviceById, getDevicesByIds } from '@/services/device.service';
import { getSessionById, getSessionsByUserId } from '@/services/session.service';
import { friendlyFormatDevice } from '@/utils/device';
import { decodeFingerprintJWT } from '@/utils/fingerprint';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const userDevicesController = async (req: Request, res: Response): Promise<void> => {
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
            return friendlyFormatDevice(device, lastSession?.logged_out ?? true, fingerprint === device.fingerprint, lastSession?._id.toString() || null, lastSession?.login_date || null, lastSession?.ip || null, lastSession?.location || null);
        });
        res.json({ status: 'OK', devices: formated });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('user devices controller error', err);
    }
};

export const userDeviceByIdController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const id = req.params.id as string;
        const device = await getDeviceById(id);
        const lastSession = device.last_session_id ? await getSessionById(device.last_session_id.toString()) : null;
        const fingerprint = decodeFingerprintJWT(req.cookies.fingerprint);

        const formated = friendlyFormatDevice(device, lastSession?.logged_out ?? true, fingerprint === device.fingerprint, lastSession?._id.toString() || null, lastSession?.login_date || null, lastSession?.ip || null, lastSession?.location || null);
        res.json({ status: 'OK', device: formated });
    }catch(err){
        if(err === DeviceError.NOT_FOUND){
            res.status(404).json({ message: 'Can\'t find device' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('user device controller error', err);
        }
    }
};

const getLastSession = (sessions: ISession[], deviceId: string): ISession|null => {
    let last_session: ISession|null = null;
    sessions.forEach(s => {
        if(s.device_id.toString() !== deviceId) return;
        if(!last_session || last_session.login_date < s.login_date) last_session = s;
    });
    return last_session;
};
