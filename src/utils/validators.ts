import { AuthenticatedRequest } from '@/middlewares/authenticate';
import { Request } from 'express';

export const verifyName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name);
};

export const verifyEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const verifyPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export const isAuthenticatedRequest = (req: Request): req is AuthenticatedRequest => {
    return !!req.user;
};
