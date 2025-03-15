import { LoginModel } from '@/models/login.model';
import { TokenModel } from '@/models/token.model';
import { UserModel } from '@/models/user.model';
import { User, UserData } from '@/models/user.types';
import { authConfig, authHandler } from '@/utils/auth';
import { toUserData } from '@/utils/helpers';
import bcrypt from 'bcrypt';

export enum LoginError {
    EMAIL_NOT_FOUND,
    NO_PASSWORD,
    INVALID_PASSWORD
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

    LoginModel.create({
        user_id: user.id,
        token_id: tokenId,
        ip: userIp
    });

    return ({
        user: toUserData(user),
        access_token,
        refresh_token
    });
};

export enum RegisterError {
    EMAIL_ALREADY_REGISTERED
}
export const registerUser = async(name: string, email: string, password: string, { userAgent, userIp }: { userAgent: string, userIp?: string }): Promise<{
    user: UserData;
    access_token: string;
    refresh_token: string;
}> => {
    const existingUser = await UserModel.findOne({ email }).lean();
    if(existingUser) throw RegisterError.EMAIL_ALREADY_REGISTERED;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: User = await UserModel.create({
        name,
        email,
        hashed_pswd: hashedPassword
    });

    const { access_token, refresh_token, hashed_token: hashedToken } = generateTokens(user.id);
    const { token_id: tokenId } = await saveToken(user.id, hashedToken, userAgent);

    LoginModel.create({
        user_id: user.id,
        token_id: tokenId,
        ip: userIp
    });

    return ({
        user: toUserData(user),
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
        expires_at: new Date(Date.now() + authConfig.refresh_token.expiry),
        user_agent: userAgent
    });

    return ({ token_id: token.id });
};
