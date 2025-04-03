import { LoginError, passkeyLoginController, passwordLoginUser } from '@/services/auth.service';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { setFingerprintTokenCookie, setTokenCookies } from '@/utils/authCookies';
import { getOrSignDevice } from '@/utils/device';
import { signFingerprintJWT } from '@/utils/fingerprint';
import { AuthenticationResponseJSON } from '@simplewebauthn/server';

export const loginPasswordController = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string, password: string };
    try{
        const { device, signed } = await getOrSignDevice(req.cookies.fingerprint, req.device);
        if(!device?._id) throw 'No Device ID';
        const deviceId = device._id.toString();
        const { user, access_token, refresh_token: refreshToken } = await passwordLoginUser(email, password, {
            deviceId,
            userIp: req.device.ip
        });

        if(signed) setFingerprintTokenCookie(res, signFingerprintJWT(device.fingerprint));
        const csrfToken = crypto.randomBytes(64).toString('hex');
        setTokenCookies(res, refreshToken, csrfToken);
        res.json({ status: 'OK', user, access_token, csrf_token: csrfToken });
    }catch(err){
        if(err === LoginError.EMAIL_NOT_FOUND || err === LoginError.INVALID_PASSWORD){
            res.status(404).json({ message: 'Incorrect email or password' });
        }else if(err === LoginError.NO_PASSWORD){
            res.status(404).json({ message: 'Account is linked and doesn\'t have password' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('Login error:', err);
        }
    }
};

export const loginPasskeyController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, response } = req.body as { email: string, response: AuthenticationResponseJSON };
        const { device, signed } = await getOrSignDevice(req.cookies.fingerprint, req.device);
        if(!device?._id) throw 'No Device ID';
        const deviceId = device._id.toString();
        const { user, access_token, refresh_token: refreshToken } = await passkeyLoginController(email, response, {
            deviceId,
            userIp: req.device.ip
        });

        if(signed) setFingerprintTokenCookie(res, signFingerprintJWT(device.fingerprint));
        const csrfToken = crypto.randomBytes(64).toString('hex');
        setTokenCookies(res, refreshToken, csrfToken);
        res.json({ status: 'OK', user, access_token, csrf_token: csrfToken });
    }catch(err){
        if(err === LoginError.EMAIL_NOT_FOUND || err === LoginError.INVALID_PASSWORD){
            res.status(404).json({ message: 'Incorrect email or password' });
        }else if(err === LoginError.NO_PASSWORD){
            res.status(404).json({ message: 'Account is linked and doesn\'t have password' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('Login error:', err);
        }
    }
};
