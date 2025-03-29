import { logoutUser } from '@/services/auth.service';
import { getSessionByToken, SessionError } from '@/services/session.service';
import { authHandler } from '@/utils/auth';
import { removeRefreshTokenCookie } from '@/utils/authCookies';
import { hashRefreshTokenData } from 'easy-token-auth';
import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken){
            res.status(400).json({ message: 'Token not found' });
            return;
        }

        const rawValue = authHandler.decodeToken(refreshToken);
        const hashedValue = hashRefreshTokenData(rawValue);
        const session = await getSessionByToken(hashedValue);

        await logoutUser(session._id.toString());

        removeRefreshTokenCookie(res);
        res.json({ status: 'OK' });
    }catch(err){
        if(err === SessionError.NOT_FOUND){
            res.status(404).json({ message: 'User logged out' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('Logout error:', err);
        }
    }
};
