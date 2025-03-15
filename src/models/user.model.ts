import { model, Schema } from 'mongoose';
import { User } from './user.types';

const userSchema = new Schema<User>({
    name: { type: String, default: null, trim: true },
    email: { type: String, trim: true, required: true },
    hashed_pswd: { type: String, trim: true, default: null },
    deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export const UserModel = model<User>('users', userSchema);
