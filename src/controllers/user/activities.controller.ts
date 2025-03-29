import { getLatestUserActivities } from '@/services/activity.service';
import { getDevicesByIds } from '@/services/device.service';
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
        const activities = await getLatestUserActivities(req.user.id, { limit });
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
