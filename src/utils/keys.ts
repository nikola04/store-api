import { generateKeyPairSync } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export type KeyPair = { publicKey: string; privateKey: string };
export const generateECDSAKeys = (): KeyPair => {
    const curve = 'prime256v1';
    return generateKeyPairSync('ec', {
        namedCurve: curve,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }
    });
};

export const readSavedKeys = (): KeyPair => {
    return ({
        privateKey: readFileSync(resolve(__dirname, '../../keys/private.key'), 'utf8'),
        publicKey: readFileSync(resolve(__dirname, '../../keys/public.key'), 'utf8')
    });
};

export default ({
    readSavedKeys,
    generateECDSAKeys
});
