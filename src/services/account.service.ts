import { AccountModel } from '@/models/account.model';
import { IAccount, IPasskey } from '@/models/account.types';
import { Schema } from 'mongoose';

export enum AccountError {
    NOT_FOUND = 'ACCNOT_FOUND',
    NOT_UPDATED = 'ACCNOT_UPDATED'
}
export const getAccountByUserId = async (userId: string|Schema.Types.ObjectId, select: string = ''): Promise<IAccount> => {
    const account = await AccountModel.findOne({ user_id: userId }).select(select).lean();
    if(!account) throw AccountError.NOT_FOUND;
    return account;
};

export const updateAccountPasskeyChallenge = async (accountId: string|Schema.Types.ObjectId, challenge: string|undefined): Promise<void> => {
    const result = await AccountModel.updateOne({ _id: accountId }, { $set: { passkey_challenge: challenge }});
    if(result.modifiedCount !== 1) throw AccountError.NOT_UPDATED;
    return;
};

export const addPasskeyToAccount = async (accountId: string|Schema.Types.ObjectId, passkey: IPasskey): Promise<void> => {
    const result = await AccountModel.updateOne({ _id: accountId }, { $push: { passkeys: passkey }, $set: { passkey_challenge: null }});
    if(result.modifiedCount !== 1) throw AccountError.NOT_UPDATED;
    return;
};
