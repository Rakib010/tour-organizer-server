import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { tourTypeController } from "./tourType.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tourType.validations";

const router = Router()

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    tourTypeController.createTourType
);

router.get("/tour-types", tourTypeController.getAllTourTypes);

router.get("/single-tour-types", tourTypeController.getSingleTourType);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourTypeController.updateTourType
);

router.delete(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourTypeController.deleteTourType
);

export const TourTypesRoutes = router 