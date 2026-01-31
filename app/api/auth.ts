import { api, setSession, endSession } from "./api";

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface ConfirmEmailRequest {
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface AppleAuthRequest {
  identity_token: string;
  given_name?: string;
  family_name?: string;
}

export interface PushTokenRequest {
  token: string;
}

// Response types
export interface User {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  auth_method: string;
  email_confirmed: boolean;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

// API calls
export async function initialize(): Promise<{ user: User }> {
  return api.get("auth/initialize");
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("auth/login", { json: data });
  await setSession(response.access_token);
  return response;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("auth/register", {
    json: data,
  });
  await setSession(response.access_token);
  return response;
}

export async function googleAuth(
  data: GoogleAuthRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("auth/google", { json: data });
  await setSession(response.access_token);
  return response;
}

export async function appleAuth(data: AppleAuthRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("auth/apple", { json: data });
  await setSession(response.access_token);
  return response;
}

export async function confirmEmail(
  data: ConfirmEmailRequest,
): Promise<{ success: boolean }> {
  return api.post("auth/confirm-email", { json: data });
}

export async function resendOTP(): Promise<{ success: boolean }> {
  return api.post("auth/resend-otp");
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<{ success: boolean }> {
  return api.post("auth/forgot-password", { json: data });
}

export async function resetPassword(
  token: string,
  data: ResetPasswordRequest,
): Promise<{ success: boolean }> {
  return api.post(`auth/reset-password/${token}`, { json: data });
}

export async function registerPushToken(
  data: PushTokenRequest,
): Promise<{ success: boolean }> {
  return api.post("auth/push-token", { json: data });
}

export async function removePushToken(
  data: PushTokenRequest,
): Promise<{ success: boolean }> {
  return api.delete("auth/push-token", { json: data });
}

export async function deleteAccount(): Promise<{ success: boolean }> {
  const response = await api.delete<{ success: boolean }>("auth/delete");
  await endSession();
  return response;
}

export async function logout(): Promise<void> {
  await endSession();
}
