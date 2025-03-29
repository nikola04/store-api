import { ObjectId, Schema } from 'mongoose';

export interface Location {
    lat?: number;
    lon?: number;
    city?: string;
    country?: string;
}

export interface Session {
    _id: ObjectId;
    user_id: Schema.Types.ObjectId;
    device_id: Schema.Types.ObjectId;
    ip?: string;
    location?: Location
    refresh_token: string|null;
    expires_at: Date|null;
    logged_out: boolean;
    logout_date: Date|null;
    login_date: Date;
    first_login_date: Date;
}
