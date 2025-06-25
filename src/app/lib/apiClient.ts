import { ApiResponse, ApiErrorResponse, ApiErrorPayload } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  // Pass the options object as the second argument to fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    // It's good practice to spread incoming options first,
    // in case you want to enforce certain defaults later.
    ...options,

    // Then define or override headers
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },

    // ✅✅✅ THIS IS THE FIX ✅✅✅
    // The credentials property is now correctly placed INSIDE the options object.
    credentials: 'include',
  });

  // --- The rest of your error handling block is perfect and needs no changes ---
  if (!response.ok) {
    let errorPayload: ApiErrorPayload;
    try {
      const errorData: ApiErrorResponse = await response.json();
      errorPayload = errorData.error;
    } catch (e) {
      errorPayload = {
        message: `An unexpected API error occurred. Status: ${response.statusText}`,
        status_code: response.status,
      };
    }
    throw new ApiClientError(
      errorPayload.message,
      errorPayload.status_code,
      errorPayload.code
    );
  }

  const result: ApiResponse<T> = await response.json();
  return result.data;
};