import { Router } from "express";
import { AuthController } from "./auth.controller";


const route = Router()

route.post('/login', AuthController.credentialsLogin)

export const AuthRoutes = route