import { Types } from "mongoose";


export interface ITour {
    title: string
    slug: string
    description?: string
    images?: string[]
    location?: string
    costFrom?: number
    starDate?: Date
    endDate?: Date
    departureLocation?: string
    arrivalLocation?: string
    included?: string[]
    exclude?: string[]
    amenities?: string[]
    tourPlan?: string[]
    maxGuest?: number
    minAge?: number
    division: Types.ObjectId
    tourType: Types.ObjectId
}