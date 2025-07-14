import express, { Request, Response } from "express"
import cors from 'cors'
import { router } from "./app/routes"
import { globalErrorhandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./app/config/passport"

const app = express()

app.use(expressSession({
    secret: "your secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())

// Route
app.use("/api/v1", router)

// Root route 
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend"
    })
})

// error middlewares
app.use(globalErrorhandler)
app.use(notFound)

export default app

