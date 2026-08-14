import express, { Request, Response } from "express"
import cors from 'cors'
import { router } from "./app/routes"
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./app/config/passport"
import { envVars } from "./app/config/env"
/* import { rateLimit } from 'express-rate-limit' */

const app = express()


/* const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1, 
})
// Apply the rate limiting middleware to all requests.
app.use(limiter) */


app.use(expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }))
/*
 * tour-server previous CORS config (kept for reference, not removed)
 *
 * app.use(cors({
 *     origin: envVars.FRONTEND_URL,
 *     credentials: true
 * }))
 */
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://tour-organizer-tawny.vercel.app",
    "http://tour-organizer-tawny.vercel.app",
    "https://tour-organizer.vercel.app",
    envVars.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
            return
        }
        callback(new Error(`Not allowed by CORS: ${origin}`))
    },
    credentials: true
}))

// Route
app.use("/api/v1", router)

// Root route 
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Backend"
    })
})

// error middlewares
app.use(globalErrorhandler)
app.use(notFound)

export default app

