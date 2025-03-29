import { User, UserData } from '@/models/user.types';

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
    return originalDevice.type === originalDevice.type && originalDevice.os === originalDevice.os && originalDevice.app === device.app;
};
