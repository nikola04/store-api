import { REFRESH_TOKEN_PATH } from '@/constants/path';
import { RegisterError, registerUser } from '@/services/auth.service';
import { authConfig } from '@/utils/auth';
import { Request, Response } from 'express';
import crypto from 'crypto';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as { name: string, email: string, password: string };
    try{
        const { user, access_token, refresh_token } = await registerUser(name, email, password, {
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
        if(err === RegisterError.EMAIL_ALREADY_REGISTERED){
            res.status(405).json({ message: 'Email is already registered' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('Register error:', err);
        }
    }
};
