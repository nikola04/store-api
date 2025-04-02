import { AccountError, getAccountByUserId } from '@/services/account.service';
import { isAuthenticatedRequest } from '@/utils/validators';
import { Request, Response } from 'express';

export const getSecurityDataController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const account = await getAccountByUserId(req.user.id);
        const data = ({
            verified_email: account.verified_email,
            enabled_2fa: account.two_factor_auth,
            last_password_change: account.password_changed_at,
            passkeys_count: account.passkeys.length
        });
        res.json({ status: 'OK', security_data: data });
    }catch(err){
        if(err === AccountError.NOT_FOUND){
            res.status(404).json({ message: 'Account not found' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account data controller error', err);
        }
    }
};
