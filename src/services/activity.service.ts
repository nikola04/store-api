import { ActivityModel } from '@/models/activity.model';
import { Activity, IActivity } from '@/models/activity.types';

export const saveLoginActivity = async (userId: string, deviceId: string, sessionId: string): Promise<IActivity> => {
    return await ActivityModel.create({
        user_id: userId,
        device_id: deviceId,
        type: Activity.LOGIN,
        login_session_id: sessionId
    });
};

export const getLatestUserActivities = async (userId: string, { limit, after }: { limit: number, after?: Date }): Promise<IActivity[]> => {
    const beforeFilter = after ? { created_at: { $gt: after } } : { };
    return await ActivityModel.find({ user_id: userId, ...beforeFilter }).sort({ created_at: -1 }).limit(limit).lean();
};

export enum ActivityError{
    NOT_FOUND = 'NOT_FOUND',
}
export const getActivityById = async (id: string): Promise<IActivity> => {
    const activity = await ActivityModel.findById(id).lean();
    if(!activity) throw ActivityError.NOT_FOUND;
    return activity;
};
