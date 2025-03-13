import { Schema } from 'mongoose';

export interface Location {
    lat?: number;
    lon?: number;
    city?: string;
    country?: string;
}

export interface Login {
    user_id: Schema.Types.ObjectId;
    hashed_token: string;
    ip: string;
    location: Location
    created_at: Date;
}
