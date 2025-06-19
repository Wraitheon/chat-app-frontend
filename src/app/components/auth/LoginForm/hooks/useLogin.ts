import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/apiRoutes';

type LoginCredentials = {
  identifier: string;
  password: string;
};

type User = {
  id: string;
  username: string;
  email: string;
  display_name: string;
  display_picture_url?: string | null;
  status_message?: string | null;
};

type LoginResponse = {
  status: string;
  data: {
    user: User;
    token: string;
  };
  message?: string; // Optional message for error cases
};

const loginUser = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  console.log('Attempting login with identifier:', credentials.identifier);

  const response = await fetch(API_ROUTES.auth.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  console.log('Login response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('Login error response:', errorData);
    throw new Error(errorData.message || `Login failed with status ${response.status}`);
  }

  const data: LoginResponse = await response.json();
  console.log('Login successful for user:', data.data.user.username);

  if (data.status !== 'success') {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  if (data.data.token) {
    document.cookie = `authToken=${data.data.token}; path=/; secure; samesite=strict; max-age=${24 * 60 * 60}`; // 24 hours
  }

  return data.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};