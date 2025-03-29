import { createDevice } from '@/utils/device';
import { NextFunction, Request, Response } from 'express';

export const extractHeaders = ({ device = false, authorization = false }) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if(device) req.device = extractDeviceHeaders(req);
        if(authorization) req.authorization = extractAuthorizationHeader(req);
        next();
    };
};

const extractAuthorizationHeader = (req: Request): Authorization => {
    try{
        const header = req.get('Authorization');
        const accessToken = header && header.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
        return ({ access_token: accessToken });
    }catch(_e){
        return ({ access_token: undefined });
    }
};

const extractDeviceHeaders = (req: Request): Device => {
    const ip = req.ip;
    try{
        const userAgent = req.get('User-Agent') ?? 'not-provided';
        const device = createDevice(userAgent);
        return ({ ...device, ip });
    }catch(_e){
        return ({ user_agent: 'not-provided', name: undefined, type: undefined, os: undefined, app: undefined, ip });
    }
};
