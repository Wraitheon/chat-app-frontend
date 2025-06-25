export interface ApiErrorPayload {
  message: string;
  status_code: number;
  code?: string; // The optional programmatic code
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}