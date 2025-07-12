import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from '../user/user.model';
import bcrypt from "bcryptjs";
import { IUser } from '../user/user.interface';
import { envVars } from '../../config/env';
import { generateToken } from '../../utils/jwt';


const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExits = await User.findOne({ email })

    if (!isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPasswordMatch = await bcrypt.compare(password as string, isUserExits.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const JwtPayload = {
        userId: isUserExits._id,
        email: isUserExits.email,
        role: isUserExits.role
    }

    const accessToken = generateToken(JwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    console.log(accessToken,"from service")

    return {
        accessToken
    }


}

export const AuthService = {
    credentialsLogin
}