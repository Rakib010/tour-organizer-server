/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import { createAccessTokenWithRefreshToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';


// Traditional Login-token base(jwt)
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

const resetPassword = async (oldPassword: string, newPassword: string, decodeToken: JwtPayload) => {

    const user = await User.findById(decodeToken.userId)


    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match")
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()

}

export const AuthService = {
    // credentialsLogin,
    getRefreshAccessToken,
    resetPassword
}