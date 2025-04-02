import { Schema } from 'mongoose';

export interface IPasskey {
    credential_id: string;
    credential_public_key: string;
    counter: number;
    transports?: AuthenticatorTransport[];
    name: string;
    created_at: Date;
    last_used_at?: Date;
}

export interface IAccount {
    _id: Schema.Types.ObjectId;
    user_id: Schema.Types.ObjectId;
    hashed_pswd?: string;
    two_factor_auth: boolean;
    passkeys: IPasskey[];
    passkey_challenge: string|null;
    verified_email: boolean;
    password_changed_at: Date|null;
};
