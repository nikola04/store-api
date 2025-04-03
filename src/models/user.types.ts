import { ObjectId, Schema } from 'mongoose';

export interface UserData{
    id: string;
    name: string|null;
    image: string|null;
    email: string;
    updated_at: Date;
    created_at: Date;
}

export interface IUser extends UserData {
    _id: ObjectId;
    account_id: Schema.Types.ObjectId|null;
    deleted: boolean;
}
