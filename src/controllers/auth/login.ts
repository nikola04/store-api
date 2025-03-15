import { LoginModel } from '@/models/login.model';
import { TokenModel } from '@/models/token.model';
import { LoginError, loginUser } from '@/services/auth';
import { authHandler } from '@/utils/auth';
import { toUserData } from '@/utils/helpers';
import { verifyEmail } from '@/utils/validators';
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || email.length <= 0
        || !password || typeof password !== 'string' || password.length <= 0
    ) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    if(!verifyEmail(email)){
        res.status(400).json({ message: 'Email is not in valid format' });
        return;
    }
    try{
        const user = await loginUser(email, password);
        const accessToken = authHandler.generateAccessToken({ id: user.id });
        const { jwt: refreshToken, hashedToken } = authHandler.generateRefreshToken();
        const token = await TokenModel.create({
            user_id: user._id,
            hashed_token: hashedToken,
            user_agent: req.device.user_agent
        });
        LoginModel.create({
            user_id: user._id,
            token_id: token._id,
            ip: req.device.ip
        });
        res.json({ status: 'OK', user: toUserData(user), accessToken, refreshToken });
    }catch(err){
        if(err === LoginError.EMAIL_NOT_FOUND || err === LoginError.INVALID_PASSWORD){
            res.status(404).json({ message: 'Incorrect email or password' });
            return;
        }
        if(err === LoginError.NO_PASSWORD){
            res.status(404).json({ message: 'Account is linked and doesn\'t have password' });
            return;
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
