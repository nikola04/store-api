import { model, Schema } from 'mongoose';
import { Login } from './login.types';

const loginSchema = new Schema<Login>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    token_id: { type: Schema.Types.ObjectId, required: true },
    ip: { type: String, default: null },
    location: {
        lat: { type: Number, default: null },
        lon: { type: Number, default: null },
        city: { type: String, default: null },
        country: { type: String, default: null },
    },
    created_at: { type: Date, default: Date.now },
});

export const LoginModel = model('logins', loginSchema);
