import { model, Schema } from 'mongoose';
import { IUser } from './user.types';

const userSchema = new Schema<IUser>({
    name: { type: String, default: null, trim: true },
    image: { type: String, default: null },
    email: { type: String, trim: true, required: true },
    hashed_pswd: { type: String, trim: true, default: null },
    deleted: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export const UserModel = model<IUser>('users', userSchema);
