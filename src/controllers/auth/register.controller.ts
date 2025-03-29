import { RegisterError, registerUser } from '@/services/auth.service';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { setFingerprintTokenCookie, setTokenCookies } from '@/utils/authCookies';
import { getOrSignDevice } from '@/utils/device';
import { signFingerprintJWT } from '@/utils/fingerprint';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as { name: string, email: string, password: string };
    try{
        const { device, signed } = await getOrSignDevice(req.cookies.fingerprint, req.device);
        if(!device?._id) throw 'No Device ID';
        const deviceId = device._id.toString();

        const { user, access_token, refresh_token: refreshToken } = await registerUser(name, email, password, {
            deviceId,
            userIp: req.device.ip
        });

        if(signed) setFingerprintTokenCookie(res, signFingerprintJWT(device.fingerprint));
        const csrfToken = crypto.randomBytes(64).toString('hex');
        setTokenCookies(res, refreshToken, csrfToken);
        res.json({ status: 'OK', user, access_token, csrf_token: csrfToken });
    }catch(err){
        if(err === RegisterError.EMAIL_ALREADY_REGISTERED){
            res.status(405).json({ message: 'Email is already registered' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('Register error:', err);
        }
    }
};
