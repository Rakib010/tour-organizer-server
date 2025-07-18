import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { tourTypeController } from "./tourType.controller";

const router = Router()

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourTypeController.createTourType
);

router.get("/tour-types", tourTypeController.getAllTourTypes);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN),
    tourTypeController.updateTourType
);

router.delete(
    "/tour-types/:id",
    checkAuth(Role.ADMIN),
    tourTypeController.deleteTourType
);

export const TourTypesRoutes = router 