import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validations";
import { multerUpload } from "../../config/multer.config";

const router = Router()

/*
 {
 file : Image
 data : body text data => req.body => req.body.data
 }
*/
// Form data -> body, file
router.post("/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(createDivisionSchema), divisionController.createDivision)

router.get("/", divisionController.getAllDivision)
router.get("/:slug", divisionController.getSingleDivision)

router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateRequest(updateDivisionSchema), divisionController.updatedDivision)

router.delete("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision)


export const DivisionRoutes = router