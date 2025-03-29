import { Response } from 'express';
import { authConfig } from './auth';

export const setTokenCookies = (response: Response, refreshToken: string, csrfToken: string): void => {
    response.cookie('csrf_token', csrfToken, {
        maxAge: authConfig.refresh_token.expiry * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.SERVER_DOMAIN}` : undefined,
        path: '/'
    });
    response.cookie('refresh_token', refreshToken, {
        maxAge: authConfig.refresh_token.expiry * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.SERVER_DOMAIN}` : undefined,
        path: '/auth'
    });
};

export const setFingerprintTokenCookie = (response: Response, token: string): void => {
    response.cookie('fingerprint', token, {
        maxAge: 1000 * 3600 * 24 * 30 * 12 * 7, // 10 years aprox.
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.SERVER_DOMAIN}` : undefined,
    });
};

export const removeRefreshTokenCookie = (response: Response): void => {
    response.cookie('refresh_token', '', {
        maxAge: -1,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.SERVER_DOMAIN}` : undefined,
        path: '/auth'
    });
};
