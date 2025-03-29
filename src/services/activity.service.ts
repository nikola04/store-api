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

export const getLatestUserActivities = async (userId: string, { limit }: { limit: number }): Promise<IActivity[]> => {
    return await ActivityModel.find({ user_id: userId }).sort({ created_at: -1 }).limit(limit).lean();
};
