import { z } from "zod";

export const UpdatePageSchema = z.object({
    pageNumber: z.number().int().positive(),
    title: z.string().min(1, "Title is required"),
    content: z.string(),
    color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color must be a valid 6-digit hex code"),
    mood: z.number().int().min(0).max(10)
});
