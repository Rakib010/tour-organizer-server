import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";

const createComment = async (payload: Partial<IComment>, userId: string) => {
    const tour = await Tour.findById(payload.tour);

    if (!tour) {
        throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
    }

    const comment = await Comment.create({
        tour: payload.tour,
        user: userId,
        content: payload.content,
        rating: payload.rating,
    });

    const populated = await Comment.findById(comment._id)
        .populate("user", "name email picture")
        .populate("tour", "title");

    return populated;
};

const getCommentsByTour = async (tourId: string) => {
    if (!tourId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour id is required");
    }

    const comments = await Comment.find({ tour: tourId })
        .populate("user", "name email picture")
        .sort({ createdAt: -1 });

    return comments;
};

const deleteComment = async (commentId: string, userId: string, role: string) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    const isOwner = comment.user.toString() === userId;
    const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own comment");
    }

    await Comment.findByIdAndDelete(commentId);
    return null;
};

export const CommentService = {
    createComment,
    getCommentsByTour,
    deleteComment,
};
