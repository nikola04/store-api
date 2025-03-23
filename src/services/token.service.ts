import { TokenModel } from '@/models/token.model';
import { Token } from '@/models/token.types';
import { ClientSession } from 'mongoose';

export enum TokenError {
    NOT_FOUND = 'NOT_FOUND',
}
export const getTokenByValue = async (hashToken: string): Promise<Token> => {
    const token = await TokenModel.findOne({ hashed_token: hashToken }).lean();
    if(!token) throw TokenError.NOT_FOUND;
    return token;
};

export const deleteTokenById = async (tokenId: string, session?: ClientSession): Promise<void> => {
    await TokenModel.deleteOne({ _id: tokenId }, { session });
};

export const updateTokenValueById = async (id: string, hashedToken: string): Promise<true> => {
    await TokenModel.updateOne({ _id: id }, { $set: { hashed_token: hashedToken } });
    return true;
};
