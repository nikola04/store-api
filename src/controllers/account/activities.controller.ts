import { ActivityError, approveActivityById, getActivityById, getLatestUserActivities } from '@/services/activity.service';
import { getDeviceById, getDevicesByIds } from '@/services/device.service';
import { decodeFingerprintJWT } from '@/utils/fingerprint';
import { getParamBooleanValue, isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const accountActivitiesController = async (req: Request, res: Response): Promise<void> => {
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
                ip: activity.ip,
                location: activity.location,
                approved: activity.approved,
                created_at: activity.created_at
            });
        });
        res.json({ status: 'OK', activities: formated });
    }catch(err){
        res.status(500).json({ message: 'Internal server error' });
        console.error('account activities controller error', err);
    }
};

export const accountActivityByIdController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const id = req.params.id;
        const activity = await getActivityById(id);
        const fingerprint = decodeFingerprintJWT(req.cookies.fingerprint);
        const device = await getDeviceById(activity.device_id.toString());
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
            ip: activity.ip,
            location: activity.location,
            approved: activity.approved,
            created_at: activity.created_at
        });
        res.json({ status: 'OK', activity: formated });
    }catch(err){
        if(err === ActivityError.NOT_FOUND){
            res.status(404).json({ message: 'Can\'t find activity.' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account activity controller error', err);
        }
    }
};

export const approveActivityController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const id = req.params.id;
        const approve = getParamBooleanValue(req.body.approve);
        if(approve === null) throw 'APPROVE_NOT_BOOL';
        await approveActivityById(id, approve);
        res.json({ status: 'OK' });
    }catch(err){
        if(err === 'APPROVE_NOT_BOOL'){
            res.status(400).json({ message: 'Param approve is not valid boolean' });
        }else if(err === ActivityError.NOT_UPDATED){
            res.status(404).json({ message: 'Error while updating document.' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account approve activity controller error', err);
        }
    }
};
