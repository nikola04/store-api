import { Document } from 'mongoose';

export interface UserData{
    name: string|null;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface User extends UserData, Document {
    hashed_pswd: string|null;
    deleted: boolean;
}
