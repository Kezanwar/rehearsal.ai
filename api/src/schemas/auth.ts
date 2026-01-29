import { z } from "zod";

export const registerSchema = z.object({
  first_name: z
    .string({ message: "First name is required" })
    .min(1, "First name is required"),
  last_name: z
    .string({ message: "Last name is required" })
    .min(1, "Last name is required"),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z.string({ message: "Password is required" }),
});

export const confirmEmailSchema = z.object({
  otp: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
});

export const changePasswordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const pushTokenSchema = z.object({
  token: z.string({ message: "Push token is required" }),
});

export const googleAuthSchema = z.object({
  token: z.string({ message: "Token is required" }),
});

export const appleAuthSchema = z.object({
  identity_token: z.string({ message: "Identity token is required" }),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type AppleAuthInput = z.infer<typeof appleAuthSchema>;
