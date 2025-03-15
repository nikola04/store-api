import { RegisterError, registerUser } from '@/services/auth';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as { name: string, email: string, password: string };
    try{
        const { user, access_token, refresh_token } = await registerUser(name, email, password, {
            userAgent: req.device.user_agent,
            userIp: req.device.ip
        });

        res.json({ status: 'OK', user, access_token, refresh_token });
    }catch(err){
        if(err === RegisterError.EMAIL_ALREADY_REGISTERED){
            res.status(405).json({ message: 'Email is already registered' });
        }else {
            res.status(500).json({ message: 'Internal server error' });
            console.error('Register error:', err);
        }
    }
};
