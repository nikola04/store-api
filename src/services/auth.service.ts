import { TokenModel } from '@/models/token.model';
import { Token } from '@/models/token.types';
import { UserModel } from '@/models/user.model';
import { User, UserData } from '@/models/user.types';
import { authConfig, authHandler } from '@/utils/auth';
import { getLoginDevice, toUserData } from '@/utils/helpers';
import bcrypt from 'bcrypt';
import { deleteTokenById, updateTokenValueById } from './token.service';
import { logoutByTokenId, saveUserLogin } from './login.service';
import mongoose from 'mongoose';

export enum LoginError {
    EMAIL_NOT_FOUND = 'email_not_found',
    NO_PASSWORD = 'no_password',
    INVALID_PASSWORD = 'invalid_password'
}
export const loginUser = async (email: string, password: string, { userAgent, userIp }: { userAgent: string, userIp?: string }): Promise<{
    user: UserData;
    access_token: string;
    refresh_token: string;
}> => {
    const user = await UserModel.findOne({ email });
    if(!user) throw LoginError.EMAIL_NOT_FOUND;

    const hashedPswd: string|null = user.hashed_pswd;
    if(!hashedPswd) throw LoginError.NO_PASSWORD;

    const isPasswordValid = await bcrypt.compare(password, hashedPswd);
    if(!isPasswordValid) throw LoginError.INVALID_PASSWORD;

    const { access_token, refresh_token, hashed_token: hashedToken } = generateTokens(user.id);
    const { token_id: tokenId } = await saveToken(user.id, hashedToken, userAgent);

    saveUserLogin(user.id, tokenId, {
        ip: userIp,
        device_type: getLoginDevice(userAgent)
    });

    return ({
        user: toUserData(user),
        access_token,
        refresh_token
    });
};

export const logoutUser = async (tokenId: string): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    await logoutByTokenId(tokenId, session);
    await deleteTokenById(tokenId, session);

    await session.commitTransaction();
};

export enum RegisterError {
    EMAIL_ALREADY_REGISTERED = 'email_already_registered'
}
export const registerUser = async (name: string, email: string, password: string, { userAgent, userIp }: { userAgent: string, userIp?: string }): Promise<{
    user: UserData;
    access_token: string;
    refresh_token: string;
}> => {
    const existingUser = await UserModel.findOne({ email }).lean();
    if(existingUser) throw RegisterError.EMAIL_ALREADY_REGISTERED;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: User = await UserModel.create({ name, email, hashed_pswd: hashedPassword });

    const { access_token, refresh_token, hashed_token: hashedToken } = generateTokens(user.id);
    const { token_id: tokenId } = await saveToken(user.id, hashedToken, userAgent);

    saveUserLogin(user.id, tokenId, {
        ip: userIp,
        device_type: getLoginDevice(userAgent)
    });

    return ({
        user: toUserData(user),
        access_token,
        refresh_token
    });
};

export const refreshUserTokens = async (token: Token): Promise<{
    access_token: string;
    refresh_token: string;
}> => {
    const { access_token, refresh_token, hashed_token } = generateTokens(String(token.user_id));
    await updateTokenValueById(String(token._id), hashed_token);

    return ({
        access_token,
        refresh_token
    });
};

const generateTokens = (userId: string): {
    access_token: string;
    refresh_token: string;
    hashed_token: string;
} => {
    const accessToken = authHandler.generateAccessToken({ id: userId });
    const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();

    return ({ access_token: accessToken, refresh_token: refreshToken, hashed_token: hashedToken });
};

const saveToken = async (userId: string, hashedToken: string, userAgent: string): Promise<{
    token_id: string;
}> => {
    const token = await TokenModel.create({
        user_id: userId,
        hashed_token: hashedToken,
        expires_at: new Date(Date.now() + authConfig.refresh_token.expiry * 1000),
        user_agent: userAgent
    });

    return ({ token_id: token.id });
};
