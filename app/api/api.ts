import ky, { KyInstance, HTTPError } from "ky";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "@/stores/auth";

const TOKEN_KEY = "auth-token";
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
const APP_VERSION = "1.0.0"; // TODO: Get from app.json or expo-constants

const CODES = {
  TOKEN_EXPIRED: 499,
  APP_UPDATE_REQUIRED: 489,
  MAINTENANCE_MODE: 599,
};

// Custom error class matching backend problem details format
export class ApiError extends Error {
  status: number;
  title: string;
  details?: Record<string, unknown>;

  constructor(
    status: number,
    title: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.details = details;
  }
}

// Mutable auth token
let authToken: string | null = null;

const kyInstance: KyInstance = ky.create({
  prefixUrl: API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-native": "true",
    "x-app-version": APP_VERSION,
  },
  hooks: {
    beforeRequest: [
      (request) => {
        if (authToken) {
          request.headers.set("x-auth-token", authToken);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        switch (response.status) {
          case CODES.APP_UPDATE_REQUIRED:
            useAuthStore.getState().setUpdateRequired(true);
            break;
          case CODES.MAINTENANCE_MODE:
            useAuthStore.getState().setMaintenanceMode(true);
            break;
          case CODES.TOKEN_EXPIRED:
            await endSession();
            useAuthStore.getState().logout();
            break;
        }
        return response;
      },
    ],
  },
});

// Wrapper that converts HTTPError to ApiError with parsed body
async function parseError(error: unknown): Promise<never> {
  if (error instanceof HTTPError) {
    let data: any = null;
    try {
      data = await error.response.json();
    } catch {
      // Response wasn't JSON
    }
    const message = data?.message || "Something went wrong";
    const title = data?.title || "UNKNOWN_ERROR";
    const details = data?.details;
    throw new ApiError(error.response.status, title, message, details);
  }
  throw error;
}

// Wrapped API methods that auto-parse errors
export const api = {
  get: async <T>(
    url: string,
    options?: Parameters<typeof kyInstance.get>[1],
  ): Promise<T> => {
    try {
      return await kyInstance.get(url, options).json<T>();
    } catch (error) {
      return parseError(error);
    }
  },
  post: async <T>(
    url: string,
    options?: Parameters<typeof kyInstance.post>[1],
  ): Promise<T> => {
    try {
      return await kyInstance.post(url, options).json<T>();
    } catch (error) {
      return parseError(error);
    }
  },
  put: async <T>(
    url: string,
    options?: Parameters<typeof kyInstance.put>[1],
  ): Promise<T> => {
    try {
      return await kyInstance.put(url, options).json<T>();
    } catch (error) {
      return parseError(error);
    }
  },
  patch: async <T>(
    url: string,
    options?: Parameters<typeof kyInstance.patch>[1],
  ): Promise<T> => {
    try {
      return await kyInstance.patch(url, options).json<T>();
    } catch (error) {
      return parseError(error);
    }
  },
  delete: async <T>(
    url: string,
    options?: Parameters<typeof kyInstance.delete>[1],
  ): Promise<T> => {
    try {
      return await kyInstance.delete(url, options).json<T>();
    } catch (error) {
      return parseError(error);
    }
  },
};

// Session management
export async function setSession(accessToken: string): Promise<void> {
  authToken = accessToken;
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
}

export async function endSession(): Promise<void> {
  authToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function restoreSession(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    authToken = token;
  }
  return token;
}

export function hasSession(): boolean {
  return authToken !== null;
}
