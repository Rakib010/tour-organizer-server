import { model, Schema } from "mongoose"
import { ITourType } from "./tourType.interface"

const tourTypeSchema = new Schema<ITourType>({
    name: { type: String, required: true, unique: true }
}, {
    timestamps: true,
    versionKey: false
})
export const TourType = model<ITourType>("TourType", tourTypeSchema)