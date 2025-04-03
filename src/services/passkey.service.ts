import { generateRegistrationOptions, RegistrationResponseJSON, verifyRegistrationResponse } from '@simplewebauthn/server';
import { AppConfig } from '@/configs/app';
import base64url from 'base64url';
import { getUserById } from './user.service';
import { getAllowedOrigins } from '@/utils/cors';
import { Limits } from '@/configs/limits';
import { addPasskeyToAccount, getAccountByUserId, updateAccountPasskeyChallenge } from './account.service';
import { IPasskey } from '@/models/account.types';

export enum PasskeyRegistrationError {
    REACHED_LIMIT = 'REACHED_PASSKEYS_LIMIT',
    NO_CHALLENGE = 'VERIFY_NO_USER_CHALLENGE',
    FAILED_VERIFICATION = 'VERIFY_FAILED'
};
export const startPasskeyRegistration = async (userId: string): Promise<PublicKeyCredentialCreationOptionsJSON> => {
    const [account, user] = await Promise.all([
        getAccountByUserId(userId),
        getUserById(userId)
    ]);
    if(account.passkeys.length >= Limits.PasskeysPerUser) throw PasskeyRegistrationError.REACHED_LIMIT;

    const options = await generateRegistrationOptions({
        rpName: AppConfig.rpName,
        rpID: AppConfig.rpID,
        userID: Buffer.from(userId, 'utf-8'),
        userName: user.email,
        userDisplayName: user.name || user.email,
        attestationType: 'none',
        excludeCredentials: account.passkeys.map(passkey => ({
            id: passkey.credential_id,
            type: 'public-key',
            transports: passkey.transports,
        })),
    });

    const passkeyChallenge = options.challenge;
    await updateAccountPasskeyChallenge(account._id, passkeyChallenge);

    return options;
};

export const verifyPasskeyRegistration = async (userId: string, attestationResponse: RegistrationResponseJSON): Promise<{ id: string; name: string; created_at: Date }> => {
    const account = await getAccountByUserId(userId, '+passkey_challenge');
    if(account.passkeys.length >= Limits.PasskeysPerUser) throw PasskeyRegistrationError.REACHED_LIMIT;
    if(!account.passkey_challenge) throw PasskeyRegistrationError.NO_CHALLENGE;

    const verification = await verifyRegistrationResponse({
        response: attestationResponse,
        expectedRPID: AppConfig.rpID,
        expectedOrigin: getAllowedOrigins()[0],
        expectedChallenge: account.passkey_challenge,
    });
    if (!verification.verified || !verification.registrationInfo) throw PasskeyRegistrationError.FAILED_VERIFICATION;

    const { credential } = verification.registrationInfo;
    const credentialPublicKey = credential.publicKey;
    const credentialID = credential.id;
    const counter = credential.counter;

    const passkeyName = 'New Passkey';
    const newPasskey: IPasskey = ({
        credential_id: base64url.encode(credentialID),
        credential_public_key: base64url.encode(Buffer.from(credentialPublicKey)),
        counter,
        name: passkeyName,
        transports: (attestationResponse.response.transports || []).filter(
            (transport): transport is AuthenticatorTransport => transport !== 'cable'
        ),
        created_at: new Date(),
    });

    await addPasskeyToAccount(account._id.toString(), newPasskey);

    return ({ id: newPasskey.credential_id, name: passkeyName, created_at: newPasskey.created_at });
};
