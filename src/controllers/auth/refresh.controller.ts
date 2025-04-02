import { authHandler } from '@/utils/auth';
import { removeRefreshTokenCookie, setFingerprintTokenCookie, setTokenCookies } from '@/utils/authCookies';
import { hashRefreshTokenData, ValidatorErrors } from 'easy-token-auth';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { refreshUserTokens } from '@/services/auth.service';
import { getSessionByToken, SessionError } from '@/services/session.service';
import { getOrSignDevice } from '@/utils/device';
import { signFingerprintJWT } from '@/utils/fingerprint';

export const refresh = async (req: Request, res: Response): Promise<void> => {
    const { refresh_token: originalRefreshToken } = req.cookies;
    try{
        const rawValue = await authHandler.verifyAndDecodeToken(originalRefreshToken);
        const tokenValue = hashRefreshTokenData(rawValue);
        const session = await getSessionByToken(tokenValue);
        if(!session){
            res.status(401).json({ message: 'Not successfull' });
            return;
        }

        const { device, signed } = await getOrSignDevice(req.cookies.fingerprint, req.device);
        if(!device?._id) throw 'No Device ID';

        if(session.logged_out || !device.last_session_id || device.last_session_id.toString() !== session._id.toString()){
            res.status(401).json({ message: 'Not successfull' });
            return;
        }

        const { access_token, refresh_token: refreshToken } = await refreshUserTokens(session._id.toString(), session.user_id.toString());

        if(signed) setFingerprintTokenCookie(res, signFingerprintJWT(device.fingerprint));
        const csrfToken = crypto.randomBytes(64).toString('hex');
        setTokenCookies(res, refreshToken, csrfToken);

        res.json({ status: 'OK', access_token, csrf_token: csrfToken });
    }catch(err){
        if(err === SessionError.NOT_FOUND){
            res.status(404).json({ message: 'User logged out' });
        }
        else if(err === ValidatorErrors.InvalidToken || err === ValidatorErrors.InvalidTokenStructure || err === ValidatorErrors.InvalidAlgorithm){
            res.status(401).json({ message: 'Invalid refresh token' });
        }else if(err === ValidatorErrors.TokenExpired){
            removeRefreshTokenCookie(res);
            res.status(401).json({ message: 'Expired refresh token' });
        }else if(err === ValidatorErrors.InvalidSecretOrKey || err === ValidatorErrors.TokenNotActive){
            res.status(401).json({ message: 'Invalid token or expired key' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('refresh controller error', err);
        }
    }
};
