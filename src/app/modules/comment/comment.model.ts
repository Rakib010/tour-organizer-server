import { model, Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>(
    {
        tour: {
            type: Schema.Types.ObjectId,
            ref: "Tour",
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = model<IComment>("Comment", commentSchema);
