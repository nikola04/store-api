import { model, Schema } from 'mongoose';
import { IActivity } from './activity.types';

const activitySchema = new Schema<IActivity>({
    user_id: { type: Schema.Types.ObjectId, required: true },
    device_id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    login_session_id: { type: Schema.Types.ObjectId, default: null },
    approved: { type: Boolean, default: null },
    created_at: { type: Date, default: Date.now }
});

export const ActivityModel = model('activities', activitySchema);
