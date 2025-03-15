import { LoginError, loginUser } from '@/services/auth';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email: string, password: string };
    try{
        const { user, access_token, refresh_token } = await loginUser(email, password, {
            userAgent: req.device.user_agent,
            userIp: req.device.ip
        });

        res.json({ status: 'OK', user, access_token, refresh_token });
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
