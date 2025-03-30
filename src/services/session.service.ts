import { authConfig } from '@/utils/auth';
import { SessionModel } from '@/models/session.model';
import { Location, ISession } from '@/models/session.types';

export const saveSession = async (userId: string, deviceId: string, refreshToken: string, ip: string|undefined, location: Location|null): Promise<ISession> => {
    return await SessionModel.create({
        user_id: userId,
        device_id: deviceId,
        ip,
        location,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + authConfig.refresh_token.expiry * 1000)
    });
};

export const updateOrSaveSession = async (userId: string, deviceId: string, refreshToken: string, ip: string|undefined, location: Location|null): Promise<ISession> => {
    return await SessionModel.findOneAndUpdate({ user_id: userId, device_id: deviceId }, { $set: {
        ip,
        location,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + authConfig.refresh_token.expiry * 1000),
        logged_out: false,
        login_date: Date.now(),
        logout_date: null
    }}, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
};

export enum SessionError {
    NOT_FOUND = 'NOT_FOUND'
}
export const getSessionById = async (id: string): Promise<ISession> => {
    const session = await SessionModel.findById(id).lean();
    if(!session) throw SessionError.NOT_FOUND;
    return session;
};
export const getSessionByToken = async (refreshToken: string): Promise<ISession> => {
    const session = await SessionModel.findOne({ refresh_token: refreshToken }).lean();
    if(!session) throw SessionError.NOT_FOUND;
    return session;
};
export const getSessionsByUserId = async (userId: string): Promise<ISession[]> => {
    return await SessionModel.find({ user_id: userId }).lean();
};

export const logoutSessionById = async (id: string): Promise<void> => {
    await SessionModel.updateOne({ _id: id }, { $set: { refresh_token: null, expires_at: Date.now(), logged_out: true, logout_date: Date.now() } });
};

export const updateSessionTokenById = async (id: string, token: string): Promise<void> => {
    await SessionModel.updateOne({ _id: id }, { $set: {
        refresh_token: token,
        expires_at: new Date(Date.now() + authConfig.refresh_token.expiry * 1000)
    } });
};
