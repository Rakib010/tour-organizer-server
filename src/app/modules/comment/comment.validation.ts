import { z } from "zod";

export const createCommentZodSchema = z.object({
    tour: z.string().min(1, "Tour id is required"),
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment must be at most 1000 characters"),
    rating: z
        .number()
        .int("Rating must be a whole number")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating must be at most 5 stars"),
});
