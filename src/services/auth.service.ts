import { UserModel } from '@/models/user.model';
import { IUser, UserData } from '@/models/user.types';
import { authHandler } from '@/utils/auth';
import { toUserData } from '@/utils/helpers';
import bcrypt from 'bcrypt';
import { logoutSessionById, saveSession, updateOrSaveSession, updateSessionTokenById } from './session.service';
import { logoutDeviceBySessionId, updateDeviceLastSessionById } from './device.service';
import { getLocationByIp } from './ip.service';
import { saveLoginActivity } from './activity.service';
import { AccountModel } from '@/models/account.model';
import { IAccount } from '@/models/account.types';
import { AuthenticationResponseJSON, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { AppConfig } from '@/configs/app';
import { getAllowedOrigins } from '@/utils/cors';
import base64url from 'base64url';

export enum LoginError {
    EMAIL_NOT_FOUND = 'email_not_found',
    NO_PASSWORD = 'no_password',
    INVALID_PASSWORD = 'invalid_password',
    NO_CHALLENGE = 'no_challenge',
    NOT_REGISTERED_PASSKEY = 'not_registered_passkey',
    VERIFICATION_ERROR = 'not_verified'
}
interface LoginResponse {
    user: UserData;
    access_token: string;
    refresh_token: string;
}

export const passwordLoginUser = async (email: string, password: string, { deviceId, userIp }: { deviceId: string, userIp?: string }): Promise<LoginResponse> => {
    const user = await UserModel.findOne({ email }).populate<{ account_id: IAccount }>('account_id', '+hashed_pswd');
    if(!user) throw LoginError.EMAIL_NOT_FOUND;
    const account = user.account_id;
    const hashedPswd: string|null = account?.hashed_pswd ?? null;
    if(!hashedPswd) throw LoginError.NO_PASSWORD;

    const isPasswordValid = await bcrypt.compare(password, hashedPswd);
    if(!isPasswordValid) throw LoginError.INVALID_PASSWORD;

    const { access_token, refresh_token, hashed_token: hashedToken } = generateTokens(user.id);

    const location = userIp ? await getLocationByIp(userIp) : null;
    const session = await updateOrSaveSession(user.id, deviceId, hashedToken, userIp, location);
    const oldDevice = await updateDeviceLastSessionById(deviceId, session._id.toString(), user.id);
    if(oldDevice && oldDevice.last_session_id && oldDevice.last_session_id.toString() !== session._id.toString()) await logoutSessionById(oldDevice.last_session_id.toString()); // in case last session didnt logout properly (if existed)
    await saveLoginActivity(user.id, deviceId, session._id.toString(), location ?? undefined, userIp);

    return ({
        user: toUserData(user as unknown as IUser),
        access_token,
        refresh_token
    });
};

export const passkeyLoginController = async (email: string, response: AuthenticationResponseJSON, { deviceId, userIp }: { deviceId: string, userIp?: string }): Promise<LoginResponse> => {
    const user = await UserModel.findOne({ email }).populate<{ account_id: IAccount }>('account_id', '+passkey_challenge');
    if(!user) throw LoginError.EMAIL_NOT_FOUND;
    const account = user.account_id;
    if(!account.passkey_challenge) throw LoginError.NO_CHALLENGE;

    const passkey = account.passkeys.find(p => p.credential_id === response.id);
    if (!passkey) throw LoginError.NOT_REGISTERED_PASSKEY;

    const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: account.passkey_challenge,
        expectedRPID: AppConfig.rpID,
        expectedOrigin: getAllowedOrigins()[0],
        credential: {
            id: passkey.credential_id,
            publicKey: base64url.toBuffer(passkey.credential_public_key),
            counter: passkey.counter
        }
    });
    if(!verification.verified) throw LoginError.VERIFICATION_ERROR;
    const { access_token, refresh_token, hashed_token: hashedToken } = generateTokens(user.id);

    const location = userIp ? await getLocationByIp(userIp) : null;
    const session = await updateOrSaveSession(user.id, deviceId, hashedToken, userIp, location);
    const oldDevice = await updateDeviceLastSessionById(deviceId, session._id.toString(), user.id);
    if(oldDevice && oldDevice.last_session_id && oldDevice.last_session_id.toString() !== session._id.toString()) await logoutSessionById(oldDevice.last_session_id.toString()); // in case last session didnt logout properly (if existed)
    await saveLoginActivity(user.id, deviceId, session._id.toString(), location ?? undefined, userIp);

    return ({
        user: toUserData(user as unknown as IUser),
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

    const user = await UserModel.create({ name, image: null, email });
    const account = await AccountModel.create({ user_id: user._id, hashed_pswd: hashedPassword });
    user.account_id = account._id;
    await user.save();

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
