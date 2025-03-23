import { getTokenByValue, TokenError } from '@/services/token.service';
import { authHandler } from '@/utils/auth';
import { removeRefreshTokenCookie, setAuthResponseCookies } from '@/utils/authCookies';
import { createDeviceFromUA, isMatchingDevice } from '@/utils/helpers';
import { hashRefreshTokenData, ValidatorErrors } from 'easy-token-auth';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { refreshUserTokens } from '@/services/auth.service';

export const refresh = async (req: Request, res: Response): Promise<void> => {
    const { refresh_token: originalRefreshToken } = req.cookies;
    try{
        const rawValue = await authHandler.verifyAndDecodeToken(originalRefreshToken);
        const tokenValue = hashRefreshTokenData(rawValue);
        const token = await getTokenByValue(tokenValue);
        const originalDevice = createDeviceFromUA(token.user_agent);
        if(token.user_agent !== 'not-provided' && !isMatchingDevice(originalDevice, req.device)) {
            res.status(400).json({ message: 'Devices doesn\'t match' });
            return;
        }

        const { access_token, refresh_token: refreshToken } = await refreshUserTokens(token);

        const csrfToken = crypto.randomBytes(64).toString('hex');
        setAuthResponseCookies(res, refreshToken, csrfToken);

        res.json({ status: 'OK', access_token, csrf_token: csrfToken });
    }catch(err){
        if(err === TokenError.NOT_FOUND){
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
        }
    }
};
