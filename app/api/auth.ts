import { api, setSession, endSession } from "./api";

// Request types
export interface EmailAuthRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
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

export interface EmailAuthResponse {
  success: boolean;
  is_new_user: boolean;
  email: string;
}

// API calls
export async function initialize(): Promise<{ user: User }> {
  return api.get("api/auth/initialize");
}

export async function sendEmailOTP(
  data: EmailAuthRequest,
): Promise<EmailAuthResponse> {
  return api.post<EmailAuthResponse>("api/auth/email", { json: data });
}

export async function verifyOTP(
  data: VerifyOtpRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("api/auth/verify-otp", {
    json: data,
  });
  await setSession(response.access_token);
  return response;
}

export async function resendOTP(
  data: ResendOtpRequest,
): Promise<{ success: boolean }> {
  return api.post("api/auth/resend-otp", { json: data });
}

export async function googleAuth(
  data: GoogleAuthRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("api/auth/google", {
    json: data,
  });
  await setSession(response.access_token);
  return response;
}

export async function appleAuth(data: AppleAuthRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("api/auth/apple", {
    json: data,
  });
  await setSession(response.access_token);
  return response;
}

export async function registerPushToken(
  data: PushTokenRequest,
): Promise<{ success: boolean }> {
  return api.post("api/auth/push-token", { json: data });
}

export async function removePushToken(
  data: PushTokenRequest,
): Promise<{ success: boolean }> {
  return api.delete("api/auth/push-token", { json: data });
}

export async function deleteAccount(): Promise<{ success: boolean }> {
  const response = await api.delete<{ success: boolean }>("api/auth/delete");
  await endSession();
  return response;
}

export async function logout(): Promise<void> {
  await endSession();
}
