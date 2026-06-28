import { ENV } from "./envvars";

const isProduction = ENV.NODE_ENV === "production";

export const AUTH_COOKIE_CONFIG = {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    // sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    // ...(isProduction && { domain: "rum-core.prabhatlabs.dev" }),
} as const;

export const AUTH_COOKIE_CLEAR_CONFIG = {
    httpOnly: true,
    maxAge: 0,
    // sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    sameSite: "lax",
    secure: isProduction,
    path: "/",
} as const;
