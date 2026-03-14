// src/schemas/auth.ts
import { z } from "zod";

export const emailAuthSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "Code must be 6 digits"),
  // Optional for new users
  first_name: z.string().min(1).max(50).optional(),
  last_name: z.string().min(1).max(50).optional(),
});

export const resendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const googleAuthSchema = z.object({
  token: z.string().min(1, "Google token is required"),
});

export const appleAuthSchema = z.object({
  identity_token: z.string().min(1, "Apple identity token is required"),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
});

export const pushTokenSchema = z.object({
  token: z.string().min(1, "Push token is required"),
});
