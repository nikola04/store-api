import { verifyEmail, verifyName, verifyPassword } from '@/utils/validators';
import { NextFunction, Request, Response } from 'express';

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction): void => {
    const { name, email, password } = req.body;
    if (!name || typeof name !== 'string' || name.length <= 0) {
        res.status(400).json({ message: 'Name is required' });
        return;
    }
    if (!email || typeof email !== 'string' || email.length <= 0) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    if(!password || typeof password !== 'string' || password.length <= 0){
        res.status(400).json({ message: 'Password is required' });
        return;
    }
    if(!verifyName(name)){
        res.status(400).json({ message: 'Name must contain at least 2 alphabetic characters' });
        return;
    }
    if(!verifyEmail(email)){
        res.status(400).json({ message: 'Email is not in valid format' });
        return;
    }
    if(!verifyPassword(password)){
        res.status(400).json({ message: 'Password must contain at least 8 characters including 1 lower case, 1 upper case, 1 number and 1 special character' });
        return;
    }
    next();
};
