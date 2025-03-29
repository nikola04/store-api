import { DeviceModel } from '@/models/device.model';
import { Device } from '@/models/device.types';

export const saveDevice = async (fingerprint: string, name?: string, type?: string, os?: string, app?: string, lastSessionId?: string, lastSessionUserId?: string): Promise<Device> => {
    return await DeviceModel.create({
        fingerprint,
        name,
        type,
        os,
        app,
        last_session_id: lastSessionId,
        last_session_user_id: lastSessionUserId
    });
};

export enum DeviceError{
    NOT_FOUND = 'NOT_FOUND',
}
export const getDeviceById = async (deviceId: string): Promise<Device> => {
    const device = await DeviceModel.findById(deviceId).lean();
    if(!device) throw DeviceError.NOT_FOUND;
    return device;
};

export const getDeviceByFingerprint = async (fingerprint: string): Promise<Device> => {
    const device = await DeviceModel.findOne({ fingerprint }).lean();
    if(!device) throw DeviceError.NOT_FOUND;
    return device;
};

export const getDevicesByIds = async (ids: string[]): Promise<Device[]> => {
    return await DeviceModel.find({ _id: { $in: ids } }).sort({ added_at: -1 });
};

export const updateDeviceLastSessionById = async (id: string, lastSessionId: string, lastSessionUserId: string): Promise<Device|null> => {
    return await DeviceModel.findByIdAndUpdate(id, { $set: { last_session_id: lastSessionId, last_session_user_id: lastSessionUserId, logged_out: false } }).lean();
};

export const logoutDeviceBySessionId = async (sessionId: string): Promise<void> => {
    await DeviceModel.updateOne({ last_session_id: sessionId }, { $set: { logged_out: true } });
};
