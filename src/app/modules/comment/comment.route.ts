import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { CommentController } from "./comment.controller";
import { createCommentZodSchema } from "./comment.validation";

const router = Router();

// POST /api/v1/comment
router.post(
    "/",
    checkAuth(...Object.values(Role)),
    validateRequest(createCommentZodSchema),
    CommentController.createComment
);

// GET /api/v1/comment?tourId=
router.get("/", CommentController.getCommentsByTour);

// DELETE /api/v1/comment/:id
router.delete(
    "/:id",
    checkAuth(...Object.values(Role)),
    CommentController.deleteComment
);

export const CommentRoutes = router;
