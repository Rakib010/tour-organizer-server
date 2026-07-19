import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload;
    const comment = await CommentService.createComment(req.body, decodeToken.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
});

const getCommentsByTour = catchAsync(async (req: Request, res: Response) => {
    const tourId = req.query.tourId as string;
    const comments = await CommentService.getCommentsByTour(tourId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comments retrieved successfully",
        data: comments,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload;
    const result = await CommentService.deleteComment(
        req.params.id,
        decodeToken.userId,
        decodeToken.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

export const CommentController = {
    createComment,
    getCommentsByTour,
    deleteComment,
};
