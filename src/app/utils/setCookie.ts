import { Response } from "express";
import { envVars } from "../config/env";


export interface AuthTokens {
    accessToken?: string,
    refreshToken?: string,

}

const getCookieOptions = () => {
    // Local dev usually runs on http://localhost, so secure cookies won't be set/cleared properly.
    const isProd = envVars.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,               // https only in production
        sameSite: (isProd ? "none" : "lax") as "none" | "lax",
        path: "/",
    };
};

// set cookies in Browser 
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            ...getCookieOptions(),
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            ...getCookieOptions(),
        })
    }
}