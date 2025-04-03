import { model, Schema } from 'mongoose';
import { IUser } from './user.types';

const userSchema = new Schema<IUser>({
    account_id: { type: Schema.Types.ObjectId, default: null, ref: 'accounts' },
    name: { type: String, default: null, trim: true },
    image: { type: String, default: null },
    email: { type: String, trim: true, required: true },
    deleted: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now, immutable: true }
});

export const UserModel = model<IUser>('users', userSchema);
