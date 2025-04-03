import { AppConfig } from '@/configs/app';
import { getAccountByUserId, updateAccountPasskeyChallenge } from '@/services/account.service';
import { getUserByEmail, UserError } from '@/services/user.service';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { Request, Response } from 'express';

export const checkEmailController = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email } = req.body;
        if (!email || typeof email !== 'string' || email.length <= 0) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const user = await getUserByEmail(email);
        const account = await getAccountByUserId(user._id, '+hashed_pswd');
        const options = account.passkeys.length > 0 ? await generateAuthenticationOptions({
            rpID: AppConfig.rpID,
            allowCredentials: account.passkeys.map(p => ({
                id: p.credential_id,
                type: 'public-key',
                transports: p.transports
            }))
        }) : null;
        const loginOptions = ({
            password: account.hashed_pswd && account.hashed_pswd.length > 0 ? true : false,
            passkeys: account.passkeys.map(passkey => ({ name: passkey.name, id: passkey.credential_id })),
            webauthn: options
        });
        if(options) await updateAccountPasskeyChallenge(account._id, options.challenge);
        res.json({ status: 'OK', options: loginOptions });
    }catch(err){
        if(err === UserError.NOT_FOUND || err === UserError.DELETED){
            res.status(404).json({ message: 'Email not found' });
        }else{
            console.error('check email controller error', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
