import { model, Schema } from 'mongoose';
import { IDevice } from './device.types';

const deviceSchema = new Schema<IDevice>({
    fingerprint: { type: String, required: true },
    name: { type: String, default: null },
    type: { type: String, default: null },
    os: { type: String, default: null },
    app: { type: String, default: null },
    last_session_id: { type: Schema.Types.ObjectId, default: null },
    last_session_user_id: { type: Schema.Types.ObjectId, default: null },
    logged_out: { type: Boolean, default: true },
    added_at: { type: Date, default: Date.now }
});

export const DeviceModel = model('devices', deviceSchema);
