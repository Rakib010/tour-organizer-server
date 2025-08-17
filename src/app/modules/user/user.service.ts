import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { QueryBuilder } from '../../utils/QueryBuilder';


const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
   

    const isUserExits = await User.findOne({ email })

    if (isUserExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "user already exist")
    }

    const hashedPassword = await bcrypt.hash(password as string, 10)

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

    const user = await User.create({
        email,
        auths: [authProvider],
        password: hashedPassword,
        ...rest

    })
    return user
}

// email - can not update
//   name, phone, password address
//   password - re hashing
//   only admin superadmin - role, isDeleted...
//   promoting to superadmin - superadmin


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const isUserExist = await User.findById(userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
        /*  if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
         } */
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })


    return newUpdatedUser

}

const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query)

    const userSearchableFields = ["name", "address", "phone"]

    const users = await queryBuilder
        .search(userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ])

    return {
        meta,
        data
    }
}

const getSingleUsers = async (id: string) => {
    const user = await User.find({ id })
    return user
}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password")
    return user
}

export const userServices = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUsers,
    getMe
}