import { Router } from "express";
import { UserController } from "./user.controller";
import { UpdateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router()


router.post("/register",
    /* validateRequest(createUserZodSchema) */
    UserController.createUser)

router.get("/all-users",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers)

router.get("/me", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER), UserController.getMe)

router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getSingleUsers)

router.patch('/:id',
    validateRequest(UpdateUserZodSchema),
    checkAuth(...Object.values(Role)),
    UserController.updateUser)


export const UserRoutes = router