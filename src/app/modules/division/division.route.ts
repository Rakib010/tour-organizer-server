import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const route = Router()

route.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.createDivision)
route.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.getAllDivision)
route.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.updatedDivision)
route.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision)


export const DivisionRoutes = route