import { Schema } from 'mongoose';

export interface Location {
    lat?: number;
    lon?: number;
    city?: string;
    country?: string;
}

export type DeviceOS = 'MacOS'|'Windows'|'IOS'|'Android'|'Linux'|'ChromeOS'
export interface Login {
    user_id: Schema.Types.ObjectId;
    token_id: Schema.Types.ObjectId;
    ip: null|string;
    device_type: null|DeviceOS;
    location: Location
    logged_out: boolean;
    created_at: Date;
}
