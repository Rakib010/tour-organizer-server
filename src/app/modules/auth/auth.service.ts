/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import { createAccessTokenWithRefreshToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { IAuthProvider, IsActive } from '../user/user.interface';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';


// custom Login -> token base(jwt)
/* const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExits = await User.findOne({ email })
    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExits.password as string)
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    // user token 
    const userToken = createUserToken(isUserExits)

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: isUserExits
    }
}
 */

const getRefreshAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

const changePassword = async (oldPassword: string, newPassword: string, decodeToken: JwtPayload) => {

    const user = await User.findById(decodeToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match")
    }
    if (oldPassword === newPassword) {
        throw new AppError(httpStatus.UNAUTHORIZED, "The old password cannot be set again")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()

}

// Use case: When a Google-authenticated user wants to set a password for logging in manually.
const setPassword = async (userId: string, plainPassword: string) => {

    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(404, "user not found ")
    }
    // If the user already has a password and signed up using Google,
    // do not allow setting a new password (only allow updating it later)
    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }
    const hashPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))

    // Create a new auth provider entry for credentials-based login
    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }
    // Add the new provider to the user's auths array
    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashPassword

    user.auths = auths

    await user.save()
}

// forgot password -> send mail -> reset password 
const forgetPassword = async (email: string) => {

    const isUserExits = await User.findOne({ email })

    // USER CHECK   
    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "user does not exist")
    }
    if (!isUserExits.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "user is  not verified")
    }
    if (isUserExits.isActive === IsActive.BLOCKED || isUserExits.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST,
            `user is ${isUserExits.isActive}`)
    }
    if (!isUserExits.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
    }

    const jwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExits._id}&token=${resetToken}`

    // send your mail
    sendEmail({
        to: isUserExits.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExits.name,
            resetUILink
        }
    })
}

// reset password 
const resetPassword = async (payload: Record<string, any>, decodeToken: JwtPayload) => {

    if (payload.id != decodeToken.userId) {
        throw new AppError(401, "You can't reset your password")
    }
    const isUserExits = await User.findById(decodeToken.userId)
    if (!isUserExits) {
        throw new AppError(401, "user does not exist")
    }
    const hashPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExits.password = hashPassword

    await isUserExits.save()
}


export const AuthService = {
    // credentialsLogin,
    getRefreshAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword
}