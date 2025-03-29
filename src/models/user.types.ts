import { ObjectId } from 'mongoose';

export interface UserData{
    id: string;
    name: string|null;
    image: string|null;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface IUser extends UserData {
    _id: ObjectId;
    hashed_pswd: string|null;
    deleted: boolean;
}
