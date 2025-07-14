import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from '../errorHelpers/AppError';


// crate access token and refresh token 
export const createUserToken = (user: Partial<IUser>) => {
    const JwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = generateToken(JwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }

}

// refresh token use kore new access token create korbe
export const createAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExits = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
    }

    if (isUserExits.isActive === IsActive.BLOCKED || isUserExits.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST,
            `user is ${isUserExits.isActive}`)
    }
    if (!isUserExits.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
    }

    const JwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }

    const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}