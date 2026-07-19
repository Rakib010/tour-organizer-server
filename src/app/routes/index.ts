import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { DivisionRoutes } from "../modules/division/division.route"
import { TourRouters } from "../modules/tour/tour.route"
import { TourTypesRoutes } from "../modules/tour type/tourType.route"
import { BookingRoutes } from "../modules/booking/booking.route"
import { paymentRoutes } from "../modules/payment/payment.route"
import { OtpRoutes } from "../modules/otp/otp.route"
import { StatsRoutes } from "../modules/stats/stats.route"
import { CommentRoutes } from "../modules/comment/comment.route"



export const router = Router()

const modulesRoute = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/division',
        route: DivisionRoutes
    },
    {
        path: '/tour',
        route: TourTypesRoutes
    },
    {
        path: '/tour',
        route: TourRouters
    },
    {
        path: '/booking',
        route: BookingRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
    {
        path: '/otp',
        route: OtpRoutes
    },
    {
        path: '/stats',
        route: StatsRoutes
    },
    {
        path: '/comment',
        route: CommentRoutes
    },

]

modulesRoute.forEach((route) => {
    router.use(route.path, route.route)
})