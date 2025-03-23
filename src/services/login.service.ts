import { LoginModel } from '@/models/login.model';
import { Login } from '@/models/login.types';
import { ClientSession } from 'mongoose';

export const saveUserLogin = async (userId: string, tokenId: string, { ip, device_type }: { ip?: string, device_type?: null|string }): Promise<Login> => {
    return await LoginModel.create({
        user_id: userId,
        token_id: tokenId,
        ip,
        device_type
    });
};

export const logoutByTokenId = async (tokenId: string, session?: ClientSession): Promise<void> => {
    await LoginModel.updateOne({ token_id: tokenId }, { $set: { logged_out: true } }, { session });
};
