import { AccountError, getAccountByUserId } from '@/services/account.service';
import { startPasskeyRegistration, verifyPasskeyRegistration, PasskeyRegistrationError } from '@/services/passkey.service';
import { UserError } from '@/services/user.service';
import { isAuthenticatedRequest } from '@/utils/validators';
import { RegistrationResponseJSON } from '@simplewebauthn/server';
import { Request, Response } from 'express';

export const startPasskeyRegistrationController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const options = await startPasskeyRegistration(req.user.id);
        res.json({ status: 'OK', options });
    }catch(err){
        if(err === UserError.NOT_FOUND || err === AccountError.NOT_FOUND){
            res.status(404).json({ message: 'User not found.' });
        }else if(err === PasskeyRegistrationError.REACHED_LIMIT){
            res.status(403).json({ message: 'Passkeys limit per account has been reached.' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account register passkey controller error', err);
        }
    }
};

export const verifyPasskeyRegistrationController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const attestationResponse = req.body.attestationResponse as RegistrationResponseJSON;
        const passkey = await verifyPasskeyRegistration(req.user.id, attestationResponse);
        res.json({ status: 'OK', verified: true, passkey });
    }catch(err){
        if(err === AccountError.NOT_FOUND){
            res.status(404).json({ message: 'User not found.' });
        }else if(err === PasskeyRegistrationError.NO_CHALLENGE){
            res.status(403).json({ message: 'Passkey registration not started yet.' });
        }else if(err === PasskeyRegistrationError.REACHED_LIMIT){
            res.status(403).json({ message: 'Passkeys limit per account has been reached.' });
        }else if(err === PasskeyRegistrationError.FAILED_VERIFICATION){
            res.status(403).json({ message: 'Verification failed.' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account verify passkey controller error', err);
        }
    }
};

export const getPasskeysController = async (req: Request, res: Response): Promise<void> => {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try{
        const account = await getAccountByUserId(req.user.id);
        const passkeys = (account.passkeys || []).map(passkey => ({ id: passkey.credential_id, name: passkey.name, created_at: passkey.created_at }));
        res.json({ status: 'OK', passkeys });
    }catch(err){
        if(err === AccountError.NOT_FOUND){
            res.status(404).json({ message: 'User not found.' });
        }else{
            res.status(500).json({ message: 'Internal server error' });
            console.error('account get passkeys controller error', err);
        }
    }
};
