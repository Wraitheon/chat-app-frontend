// This represents the nested 'error' object in your error response
export interface ApiErrorPayload {
  message: string;
  status_code: number;
  code?: string; // The optional programmatic code
}

// This represents the full error response body
export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

// Your existing success response type remains valuable!
export interface ApiResponse<T> {
  status: 'success'; // Or `success: true` if your backend uses that
  results?: number;
  data: T;
}