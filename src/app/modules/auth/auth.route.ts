import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";


const route = Router() 

route.post('/login', AuthController.credentialsLogin)
route.post('/refresh-token', AuthController.getRefreshAccessToken)
route.post('/logout', AuthController.accessTokenLogout)

route.post('/change-password',
    checkAuth(...Object.values(Role)),
    AuthController.changePassword)

route.post('/set-password',
    checkAuth(...Object.values(Role)),
    AuthController.setPassword)

route.post('/forget-password',
    checkAuth(...Object.values(Role)),
    AuthController.forgetPassword)

route.post('/reset-password',
    checkAuth(...Object.values(Role)),
    AuthController.resetPassword)

// /booking -> /login -> success login -> /booking frontend
// /login -> login -> /booking
route.get('/google', async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect as string
    })(req, res, next)
})

route.get('/google/callback', passport.authenticate("google",
    { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issue with your account.contact our support team` }), AuthController.googleCallBack)


export const AuthRoutes = route


