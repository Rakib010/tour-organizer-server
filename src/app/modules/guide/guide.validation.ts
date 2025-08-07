
import { z } from 'zod';

// applyForGuide
export const applyForGuideZodSchema = z.object({
    body: z.object({
        divisionId: z.string({
            required_error: 'Division ID is required',
        }),
    }),
});

// approveOrRejectGuide
export const approveOrRejectGuideZodSchema = z.object({
    body: z.object({
        status: z.enum(['APPROVED', 'REJECTED'], {
            required_error: 'Status must be APPROVED or REJECTED',
        }),
    }),
});
