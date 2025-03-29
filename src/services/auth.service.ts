import { UserModel } from '@/models/user.model';
import { User, UserData } from '@/models/user.types';
import { authHandler } from '@/utils/auth';
import { toUserData } from '@/utils/helpers';
import bcrypt from 'bcrypt';
import { logoutSessionById, saveSession, updateOrSaveSession, updateSessionTokenById } from './session.service';
import { logoutDeviceBySessionId, updateDeviceLastSessionById } from './device.service';
import { getLocationByIp } from './ip.service';

export enum LoginError {
    EMAIL_NOT_FOUND = 'email_not_found',
    NO_PASSWORD = 'no_password',
    INVALID_PASSWORD = 'invalid_password'
}
export const loginUser = async (email: string, password: string, { deviceId, userIp }: { deviceId: string, userIp?: string }): Promise<{
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

    const location = userIp ? await getLocationByIp(userIp) : null;
    const session = await updateOrSaveSession(user.id, deviceId, hashedToken, userIp, location);
    const oldDevice = await updateDeviceLastSessionById(deviceId, session._id.toString(), user.id);
    if(oldDevice && oldDevice.last_session_id && oldDevice.last_session_id.toString() !== session._id.toString()) await logoutSessionById(oldDevice.last_session_id.toString()); // in case last session didnt logout properly (if existed)

    return ({
        user: toUserData(user),
        access_token,
        refresh_token
    });
};

export const logoutUser = async (sessionId: string): Promise<void> => {
    await Promise.all([
        logoutSessionById(sessionId),
        logoutDeviceBySessionId(sessionId)
    ]);
};

export enum RegisterError {
    EMAIL_ALREADY_REGISTERED = 'email_already_registered'
}
export const registerUser = async (name: string, email: string, password: string, { deviceId, userIp }: { deviceId: string, userIp?: string }): Promise<{
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

    const location = userIp ? await getLocationByIp(userIp) : null;
    const session = await saveSession(user.id, deviceId, hashedToken, userIp, location);
    await updateDeviceLastSessionById(deviceId, session._id.toString(), user.id);

    return ({
        user: toUserData(user),
        access_token,
        refresh_token
    });
};

export const refreshUserTokens = async (sessionId: string, userId: string): Promise<{
    access_token: string;
    refresh_token: string;
}> => {
    const { access_token, refresh_token, hashed_token } = generateTokens(userId);
    await updateSessionTokenById(sessionId, hashed_token);

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
