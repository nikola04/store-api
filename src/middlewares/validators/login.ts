import { verifyEmail } from '@/utils/validators';
import { NextFunction, Request, Response } from 'express';

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || email.length <= 0) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    if(!password || typeof password !== 'string' || password.length <= 0){
        res.status(400).json({ message: 'Password is required' });
        return;
    }
    if(!verifyEmail(email)){
        res.status(400).json({ message: 'Email is not in valid format' });
        return;
    }
    next();
};
