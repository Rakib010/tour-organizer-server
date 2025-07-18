import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { DivisionRoutes } from "../modules/division/division.route"
import { TourRouters } from "../modules/tour/tour.route"
import { TourTypesRoutes } from "../modules/tour type/tourType.route"


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

]

modulesRoute.forEach((route) => {
    router.use(route.path, route.route)
})