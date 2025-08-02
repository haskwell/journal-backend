import { z } from "zod";

export const RegisterSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const PasswordResetRequestSchema = z.object({
    email: z.email("Invalid email address"),
});

export const PasswordResetSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    token: z.string()
})

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type PasswordResetRequestSchema = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetSchema = z.infer<typeof PasswordResetSchema>;