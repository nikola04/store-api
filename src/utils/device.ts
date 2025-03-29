import crypto from 'crypto';
import { IOS, UAParser } from 'ua-parser-js';
import { decodeFingerprintJWT } from './fingerprint';
import { DeviceError, getDeviceByFingerprint, saveDevice } from '@/services/device.service';
import { Device as SavedDevice } from '@/models/device.types';

export const createFingerprint = (): string => {
    return crypto.randomBytes(64).toString('hex');
};

export const createDevice = (userAgent: string): Device => {
    if(userAgent === 'not-provided') return ({ user_agent: userAgent });
    const parser = new UAParser(userAgent);

    const name = getDeviceName(parser);

    const device = parser.getDevice();
    const type = getDeviceType(device.type);

    const osName = parser.getOS().name;
    const os = getDeviceOS(osName);

    const app = parser.getBrowser().name;

    return ({ user_agent: userAgent, name, type, os, app });
};

const getNameFromOS = (os: IOS): string|undefined => {
    const { name, version } = os;
    if(name !== 'Windows' || !version) return;
    if(!version) return name;
    const _version = version === '10' ? '10/11' : version;
    return `${name} ${_version}`;
};

export const getDeviceName = (parser: UAParser): string|undefined => {
    const { vendor, model } = parser.getDevice();
    if(!vendor && !model) return getNameFromOS(parser.getOS());
    if(!model) return vendor;
    if(!vendor) return model;
    return `${vendor} ${model}`;
};

export const getDeviceType = (deviceType?: string): DeviceType|undefined => {
    if(!deviceType || typeof deviceType !== 'string') return 'Desktop';

    switch(deviceType.toLowerCase()){
    case 'mobile': return 'Mobile';
    case 'tablet': return 'Tablet';
    case 'console': return 'Console';
    case 'smarttv': return 'SmartTV';
    case 'embedded': return 'Embedded';
    case 'wearable': return 'Wearable';
    case 'xr': return 'XR';
    default: return 'Desktop';
    };
};

export const getDeviceOS = (osName?: string): DeviceOS|undefined => {
    if(!osName || typeof osName !== 'string') return undefined;

    switch (osName.toLowerCase()) {
    case 'linux': case 'debian': case 'fedora': case 'arch': case 'redhat': case 'ubuntu': return 'Linux';
    case 'windows': case 'windows phone': case 'windows mobile': case 'windows nt': return 'Windows';
    case 'playstation': return 'Playstation';
    case 'nintendo': return 'Nintendo';
    case 'xbox': return 'Xbox';
    case 'macos': return 'MacOS';
    case 'ios': return 'IOS';
    case 'android': case 'android-x86': return 'Android';
    case 'linux': return 'Linux';
    case 'chrome os': return 'ChromeOS';
    default: return undefined;
    };
};

export const getFingerprintJWTDevice = async (token: string | undefined | null): Promise<SavedDevice | null> => {
    try {
        if (token) {
            const fingerprint = decodeFingerprintJWT(token);
            if (fingerprint) {
                return await getDeviceByFingerprint(fingerprint);
            }
        }
    } catch (err) {
        if (err !== DeviceError.NOT_FOUND)
            console.error('Error tracing fingerprint', err);
    }
    return null;
};

export const getOrSignDevice = async (token: string|undefined|null, device: Device): Promise<{ device: SavedDevice|null, signed: boolean }> => {
    const existingDevice = await getFingerprintJWTDevice(token);
    if(existingDevice) return ({ device: existingDevice, signed: false });
    const newFingerprint = createFingerprint();
    const savedDevice = await saveDevice(newFingerprint, device.name, device.type, device.os, device.app);
    return ({ device: savedDevice, signed: true });
};
