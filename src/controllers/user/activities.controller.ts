import { getActivityById, getLatestUserActivities } from '@/services/activity.service';
import { getDeviceById, getDevicesByIds } from '@/services/device.service';
import { getSessionById } from '@/services/session.service';
import { decodeFingerprintJWT } from '@/utils/fingerprint';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const userActivitiesController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const _limit = req.query.limit;
        const limit = (_limit && !isNaN(Number(_limit)) && Number(_limit) > 0 && Number(_limit) < 50) ? Number(_limit) : 10;
        const after = new Date();
        after.setDate(after.getDate() - 21); // last 21 days
        const activities = await getLatestUserActivities(req.user.id, { limit, after });
        const devicesIds: string[] = [];
        activities.forEach(activity => {
            const id = activity.device_id.toString();
            if(!devicesIds.includes(id)) devicesIds.push(id);
        });
        const devices = await getDevicesByIds(devicesIds);
        const formated = activities.map(activity => {
            const _device = devices.find((device) => device._id.toString() === activity.device_id.toString());
            const device = _device ? ({
                name: _device.name,
                type: _device.type,
                os: _device.os,
                app: _device.app
            }) : undefined;
            return ({
                id: activity._id,
                device_id: activity.device_id,
                device,
                type: activity.type,
                login_session_id: activity.login_session_id,
                approved: activity.approved,
                created_at: activity.created_at
            });
        });
        res.json({ status: 'OK', activities: formated });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('user logins controller error', err);
    }
};

export const userActivityByIdController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const id = req.params.id as string;
        const activity = await getActivityById(id);
        const fingerprint = decodeFingerprintJWT(req.cookies.fingerprint);
        const [device, _session] = await Promise.all([
            getDeviceById(activity.device_id.toString()),
            activity.login_session_id ? await getSessionById(activity.login_session_id.toString()) : null
        ]);
        const session = _session ? ({
            ip: _session.ip,
            location: _session.location,
        }) : undefined;

        const formated = ({
            id: activity._id,
            device_id: activity.device_id,
            device: {
                name: device.name,
                type: device.type,
                os: device.os,
                app: device.app,
                current_device: device.fingerprint === fingerprint
            },
            type: activity.type,
            login_session_id: activity.login_session_id,
            session,
            approved: activity.approved,
            created_at: activity.created_at
        });
        res.json({ status: 'OK', activity: formated });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('user logins controller error', err);
    }
};
