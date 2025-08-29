import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { IsActive } from '../modules/user/user.interface';

export const checkAuth = (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const accessToken = req.headers.authorization || req.cookies.accessToken;
            console.log("accessToken", accessToken)

            if (!accessToken) {
                throw new AppError(403, "No Token Received")
            }

            const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload


            const isUserExits = await User.findOne({ email: verifiedToken.email })

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


            // roles
            if (!authRoles.includes(verifiedToken.role)) {
                throw new AppError(403, "You are not permitted to view this route!!!")
            }


            req.user = verifiedToken
            next()

        } catch (error) {
            next(error)
        }
    }