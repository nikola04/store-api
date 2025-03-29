import { model, Schema } from 'mongoose';
import { ISession } from './session.types';

const sessionSchema = new Schema<ISession>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    device_id: { type: Schema.Types.ObjectId, required: true },
    ip: { type: String, default: undefined },
    location: {
        lat: { type: Number, default: undefined },
        lon: { type: Number, default: undefined },
        city: { type: String, default: undefined },
        country: { type: String, default: undefined },
    },
    refresh_token: { type: String, required: true },
    expires_at: { type: Date, required: true },
    logged_out: { type: Boolean, default: false },
    logout_date: { type: Date, default: null },
    login_date: { type: Date, default: Date.now },
    first_login_date: { type: Date, default: Date.now }
});

export const SessionModel = model('sessions', sessionSchema);
