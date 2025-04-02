import { ActivityModel } from '@/models/activity.model';
import { Activity, IActivity } from '@/models/activity.types';
import { Location } from '@/models/session.types';

export const saveLoginActivity = async (userId: string, deviceId: string, sessionId: string, location?: Location, ip?: string): Promise<IActivity> => {
    return await ActivityModel.create({
        user_id: userId,
        device_id: deviceId,
        type: Activity.LOGIN,
        login_session_id: sessionId,
        location: location,
        ip: ip
    });
};

export const getLatestUserActivities = async (userId: string, { limit, after }: { limit: number, after?: Date }): Promise<IActivity[]> => {
    const beforeFilter = after ? { created_at: { $gt: after } } : { };
    return await ActivityModel.find({ user_id: userId, ...beforeFilter }).sort({ created_at: -1 }).limit(limit).lean();
};

export enum ActivityError{
    NOT_FOUND = 'NOT_FOUND',
    NOT_UPDATED = 'NOT_UPDATED'
}
export const getActivityById = async (id: string): Promise<IActivity> => {
    const activity = await ActivityModel.findById(id).lean();
    if(!activity) throw ActivityError.NOT_FOUND;
    return activity;
};

export const approveActivityById = async (id: string, approved: boolean): Promise<void> => {
    const result = await ActivityModel.updateOne({ _id: id }, { $set: { approved: approved } });
    if(result.modifiedCount !== 1) throw ActivityError.NOT_UPDATED;
    return;
};
