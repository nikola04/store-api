import { REFRESH_TOKEN_PATH } from '@/constants/path';
import { LoginError, loginUser } from '@/services/auth.service';
import { authConfig } from '@/utils/auth';
import { Request, Response } from 'express';
import crypto from 'crypto';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string, password: string };
    try{
        const { user, access_token, refresh_token } = await loginUser(email, password, {
            userAgent: req.device.user_agent,
            userIp: req.device.ip
        });

        const csrfToken = crypto.randomBytes(64).toString('hex');
        res.cookie('csrf_token', csrfToken, {
            maxAge: authConfig.refresh_token.expiry * 1000,
            httpOnly: true,
        });
        res.cookie('refresh_token', refresh_token, {
            maxAge: authConfig.refresh_token.expiry * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            domain: process.env.NODE_ENV === 'production' ? `.${process.env.SERVER_DOMAIN}` : undefined,
            path: REFRESH_TOKEN_PATH
        });
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
