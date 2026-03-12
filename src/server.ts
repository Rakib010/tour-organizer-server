/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import { envVars } from './app/config/env';
import { Server } from "http"
import mongoose from "mongoose"
import app from "./app"
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
import { connectRedis } from './app/config/redis.config';

let server: Server

const startServer = async () => {
    try {

        await mongoose.connect(envVars.DB_URL!)

        console.log("Connect to DB!")

        server = app.listen(envVars.PORT, () => {
            console.log(`server is listening to port ${envVars.PORT}`)
        })

    } catch (error) {
        console.log(error)
    }

}
/*
 * tour-server previous startup flow (kept for reference, not removed)
 *
 * (async () => {
 *     await connectRedis()
 *     await startServer()
 *     await seedSuperAdmin()
 * })()
 */

(async () => {
    try {
        await connectRedis()
    } catch (e) {
        console.warn("Redis init error (continuing without Redis):", e)
    }
    await startServer()
    await seedSuperAdmin()
})()


/* 
* unhandled rejection error
* uncaught rejection error 
* signal termination sigterm
*/

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected... Server shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
// Promise.reject(new Error("I forgot to catch this promise"))

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected... Server shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
//throw new Error('I forgot to handle this error')

process.on("SIGTERM", (err) => {
    console.log("SIGTERM signal received... Server shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT", (err) => {
    console.log("SIGINT signal received... Server shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})



