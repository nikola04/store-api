import { getUserById, UserError } from '@/services/user.service';
import { toUserData } from '@/utils/helpers';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const currentUserController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const user = await getUserById(req.user.id);
        res.json({ status: 'OK', user: toUserData(user) });
    }catch(err){
        if(err === UserError.NOT_FOUND){
            res.status(404).json({ message: 'User not found' });
        }else if(err === UserError.DELETED){
            res.status(403).json({ message: 'User account is deleted' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('currentUser controller error', err);
        }
    }
};

export const userByIdController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const user = await getUserById(req.params.id);
        res.json({ status: 'OK', user: toUserData(user) });
    }catch(err){
        if(err === UserError.NOT_FOUND){
            res.status(404).json({ message: 'User not found' });
        }else if(err === UserError.DELETED){
            res.status(403).json({ message: 'User account is deleted' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('userById controller error', err);
        }
    }
};
