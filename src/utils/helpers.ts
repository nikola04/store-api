import { DeviceOS } from '@/models/login.types';
import { User, UserData } from '@/models/user.types';
import { UAParser } from 'ua-parser-js';

/**
 * Converts User object in UserData.
 * @param user - User object.
 * @returns UserData object without sensitive data.
 */
export const toUserData = (user: User): UserData => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
};

export const isMatchingDevice = (originalDevice: Device, device: Device): boolean => {
    return originalDevice.type === originalDevice.type && originalDevice.vendor === originalDevice.vendor && originalDevice.model === device.model;
};

export const createDeviceFromUA = (userAgent: string): Device => {
    if(userAgent === 'not-provided') return ({ user_agent: userAgent });
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    return ({ user_agent: userAgent, type: device.type, vendor: device.vendor, model: device.model });
};

export const getLoginDevice = (userAgent: string): DeviceOS|null => {
    if(userAgent === 'not-provided') return null;
    const parser = new UAParser(userAgent);
    const os = parser.getOS();
    const osName = os.name?.toLowerCase();
    console.log(osName);

    switch (osName) {
    case 'windows':
        return 'Windows';
    case 'macos':
        return 'Mac';
    case 'ios':
        return 'IOS';
    case 'android':
        return 'Android';
    case 'linux':
        return 'Linux';
    case 'chrome os':
        return 'ChromeOS';
    };
    return null;
};
