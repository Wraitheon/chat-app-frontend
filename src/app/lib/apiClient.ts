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

const normalizeHeaders = (input?: HeadersInit): Record<string, string> => {
  if (!input) return {};

  if (input instanceof Headers) {
    const headersObj: Record<string, string> = {};
    input.forEach((value, key) => {
      headersObj[key] = value;
    });
    return headersObj;
  }

  if (Array.isArray(input)) {
    return Object.fromEntries(input) as Record<string, string>;
  }

  return { ...input };
};

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const rawHeaders = normalizeHeaders(options?.headers);
  if (options?.body instanceof FormData) {
    delete rawHeaders['Content-Type'];
  } else {
    if (!rawHeaders['Content-Type']) {
      rawHeaders['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: rawHeaders,
    credentials: 'include',
  });

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