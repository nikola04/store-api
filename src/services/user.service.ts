import { UserModel } from '@/models/user.model';
import { IUser } from '@/models/user.types';

export enum UserError {
    NOT_FOUND = 'NOT_FOUND',
    DELETED = 'DELETED'
}
export const getUserById = async (userId: string): Promise<IUser> => {
    const user = await UserModel.findById(userId).lean();
    if(!user) throw UserError.NOT_FOUND;
    if(user.deleted) throw UserError.DELETED;
    return user;
};

export const getUserByEmail = async (email: string): Promise<IUser> => {
    const user = await UserModel.findOne({ email: email }).lean();
    if(!user) throw UserError.NOT_FOUND;
    if(user.deleted) throw UserError.DELETED;
    return user;
};
