import { Response } from 'express';
import { authConfig } from './auth';

export const setAuthResponseCookies = (response: Response, refreshToken: string, csrfToken: string): void => {
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
