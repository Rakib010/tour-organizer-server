
import { Types } from 'mongoose';

export type GuideStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IGuide {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    nidPhoto: string;
    division: Types.ObjectId;
    status?: GuideStatus;
    createdAt?: Date;
    updatedAt?: Date;
}