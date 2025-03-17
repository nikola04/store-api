import { UserModel } from '@/models/user.model';
import { UserData } from '@/models/user.types';
import { toUserData } from '@/utils/helpers';

export enum UserError {
    NOT_FOUND = 'NOT_FOUND',
    DELETED = 'DELETED'
}
export const getUserById = async (userId: string): Promise<UserData> => {
    const user = await UserModel.findById(userId).lean();
    if(!user) throw UserError.NOT_FOUND;
    if(user.deleted) throw UserError.DELETED;
    return toUserData(user);
};
