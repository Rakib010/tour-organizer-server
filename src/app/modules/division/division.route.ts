import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validations";

const router = Router()

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDivisionSchema), divisionController.createDivision)

router.get("/", divisionController.getAllDivision)
router.get("/:slug", divisionController.getSingleDivision)

router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDivisionSchema), divisionController.updatedDivision)

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision)


export const DivisionRoutes = router