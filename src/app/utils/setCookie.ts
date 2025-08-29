import { Response } from "express";


export interface AuthTokens {
    accessToken?: string,
    refreshToken?: string,

}

// set cookies in Browser 
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            // secure: false,
            secure: true,
            sameSite: "none"
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            //secure: false,
            sameSite: "none"
        })
    }
}