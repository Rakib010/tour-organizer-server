import { Types } from "mongoose";

export interface IComment {
    tour: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    rating: number;
    createdAt?: Date;
    updatedAt?: Date;
}
