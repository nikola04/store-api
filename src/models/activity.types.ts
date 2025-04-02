import { ObjectId } from 'mongoose';

export enum Activity{
    LOGIN = 'login'
}
export interface IActivity {
    _id: ObjectId;
    user_id: ObjectId;
    device_id: ObjectId;
    type: Activity;
    login_session_id?: ObjectId;
    location?: Location;
    ip?: string;
    approved: boolean|null;
    created_at: Date;
}
