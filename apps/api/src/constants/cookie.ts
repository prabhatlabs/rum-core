import { ENV } from "./envvars"

export const AUTH_COOKIE_CONFIG = {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: (ENV.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    secure: ENV.NODE_ENV === 'production',
    path: '/',
}

export const AUTH_COOKIE_CLEAR_CONFIG = {
    ...AUTH_COOKIE_CONFIG,
    maxAge: 0,
    value: '',
}