import {  z } from 'zod';

export const createTourZodSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    location: z.string().optional(),
    costFrom: z.number().optional(),
    starDate: z.string().optional(),
    endDate: z.string().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    included: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuest: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string().min(24), // ObjectId string division
    tourType: z.string().min(24), // ObjectId string tourType
});
