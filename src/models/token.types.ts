import { Schema } from 'mongoose';

export interface Token {
    user_id: Schema.Types.ObjectId;
    hashed_token: string;
    user_agent: string;
    expires_at: Date;
    created_at: Date;
}
