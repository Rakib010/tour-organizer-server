
import { Schema, model } from 'mongoose';
import { IGuide } from './guide.interface';

const guideSchema = new Schema<IGuide>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        nidPhoto: { type: String, required: true },
        division: { type: Schema.Types.ObjectId, ref: 'Division', required: true },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
        },
    },
    { timestamps: true }
);

export const Guide = model<IGuide>('Guide', guideSchema);
