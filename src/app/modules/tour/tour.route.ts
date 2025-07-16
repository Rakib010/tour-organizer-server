import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createTourZodSchema } from "./tour.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router()

router.post(
    '/create',
    validateRequest(createTourZodSchema),
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    tourController.createTour
);

//router.get('/', tourController.getAllTours);
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), tourController.updateTour);
router.delete('/:id', checkAuth(Role.SUPER_ADMIN, Role.ADMIN), tourController.deleteTour);




export const TourRouters = router