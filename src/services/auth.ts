import { UserModel } from '@/models/user.model';
import { User } from '@/models/user.types';
import bcrypt from 'bcrypt';

export enum LoginError {
    EMAIL_NOT_FOUND,
    NO_PASSWORD,
    INVALID_PASSWORD
}
export const loginUser = async (email: string, password: string): Promise<User> => {
    const user: User|null = await UserModel.findOne({ email }).lean();
    if(!user) throw LoginError.EMAIL_NOT_FOUND;
    const hashedPswd: string|null = user.hashed_pswd;
    if(!hashedPswd) throw LoginError.NO_PASSWORD;
    const isPasswordValid = await bcrypt.compare(password, hashedPswd);
    if(!isPasswordValid) throw LoginError.INVALID_PASSWORD;
    return user;
};
