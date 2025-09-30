// validators/authSchemas.ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/\d/, "Must include a number"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotSchema = z.object({
  email: z.string().email(),
});

export const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/\d/, "Must include a number"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string()
    .min(8)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/\d/, "Must include a number"),
});
