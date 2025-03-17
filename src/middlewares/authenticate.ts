import { authHandler } from '@/utils/auth';
import { ValidatorErrors } from 'easy-token-auth';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}

export const authenticate = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.authorization?.access_token;
        if (!token) {
            res.status(401).json({ message: 'No authorization token' });
            return;
        }
        try{
            const data = authHandler.verifyAndDecodeToken(token);
            const userId = data.id;
            (req as AuthenticatedRequest).user = {
                id: userId
            };
            next();
        }catch(err){
            if(err === ValidatorErrors.InvalidToken || err === ValidatorErrors.InvalidTokenStructure || err === ValidatorErrors.InvalidAlgorithm){
                res.status(401).json({ message: 'Invalid authorization token' });
            }else if(err === ValidatorErrors.TokenExpired){
                res.status(401).json({ message: 'Expired authorization token' });
            }else if(err === ValidatorErrors.InvalidSecretOrKey || err === ValidatorErrors.TokenNotActive){
                res.status(401).json({ message: 'Invalid token or expired key' });
            }else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
};
