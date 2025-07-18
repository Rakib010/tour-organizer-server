import { model, Schema, } from "mongoose";
import { ITour } from "./tour.interface";



const tourSchema = new Schema<ITour>({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costForm: { type: Number },
    starDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    exclude: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }
}, {
    timestamps: true
})

export const Tour = model<ITour>("Tour", tourSchema)