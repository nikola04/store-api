import { User, UserData } from '@/models/user.types';

/**
 * Converts User object in UserData.
 * @param user - User object.
 * @returns UserData object without sensitive data.
 */
export const toUserData = (user: User): UserData => {
    return {
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
};
