import { IDivision } from './division.interface';
import { Schema, model } from "mongoose";


const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },


}, {
    timestamps: true
})

export const Division = model<IDivision>("Division", divisionSchema)
