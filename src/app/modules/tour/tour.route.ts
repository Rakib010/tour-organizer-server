import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createTourZodSchema } from "./tour.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { multerUpload } from "../../config/multer.config";

const router = Router()

router.post(
    '/create',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"), // file upload
    validateRequest(createTourZodSchema),
    tourController.createTour
);

router.get('/get', tourController.getAllTours);

router.patch('/:id',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"), // file upload
    tourController.updateTour);

router.delete('/:id',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN), tourController.deleteTour);




export const TourRouters = router