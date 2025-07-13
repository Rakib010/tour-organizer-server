import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const route = Router()

route.post('/login', AuthController.credentialsLogin)
route.post('/refresh-token', AuthController.getRefreshAccessToken)
route.post('/logout', AuthController.accessTokenLogout)

route.post('/reset-password', checkAuth(...Object.values(Role)), AuthController.resetPassword)


export const AuthRoutes = route