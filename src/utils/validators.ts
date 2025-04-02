import { AuthenticatedRequest } from '@/middlewares/authenticate';
import { Location } from '@/models/session.types';
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

export const isLocation = (data: unknown): data is Location => {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const location = data as Location;

    const hasValidLat = location.lat === undefined || typeof location.lat === 'number';
    const hasValidLon = location.lon === undefined || typeof location.lon === 'number';
    const hasValidCity = location.city === undefined || typeof location.city === 'string';
    const hasValidCountry = location.country === undefined || typeof location.country === 'string';

    return hasValidLat && hasValidLon && hasValidCity && hasValidCountry;
};

export const getParamBooleanValue = (param: unknown): boolean|null => {
    if(param === 'true' || param === true) return true;
    if(param === 'false' || param === false) return false;
    return null;
};
