import { ObjectId } from 'mongoose';

export interface Device {
    _id: ObjectId;
    name?: string;
    type?: DeviceType;
    os?: DeviceOS;
    app?: string;
    fingerprint: string;
    last_session_id: ObjectId|null;
    last_session_user_id: ObjectId|null;
    logged_out: boolean;
    added_at: Date;
}
