import jwt, { JwtPayload } from 'jsonwebtoken';
import Keys from './keys';

// const { privateKey, publicKey } = Keys.generateECDSAKeys();
const { privateKey, publicKey } = Keys.readSavedKeys();

export const signFingerprintJWT = (fingerprint: string): string => {
    return jwt.sign({ data: fingerprint }, privateKey, { algorithm: 'ES384', expiresIn: 3600 * 24 * 30 * 12 * 7 });
};

export const decodeFingerprintJWT = (token: string): string|null => {
    try{
        const decoded = jwt.verify(token, publicKey, { algorithms: ['ES384'] }) as JwtPayload;
        if(!decoded || !decoded.data) return null;
        return decoded.data;
    }catch(_){
        return null;
    }
};
