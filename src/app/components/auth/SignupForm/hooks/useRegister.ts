import { useMutation } from '@tanstack/react-query';
import { API_ROUTES } from '@/app/lib/apiRoutes';

type RegistrationData = {
  username: string;
  email: string;
  password: string;
  displayName: string;
};

type User = {
  id: string;
  username: string;
  email: string;
  display_name: string;
  display_picture_url?: string | null;
  status_message?: string | null;
};

type RegisterResponse = {
  status: string;
  data: {
    user: User;
    token: string;
  };
  message?: string; // Optional message for error cases
};

const registerUser = async (userData: RegistrationData): Promise<{ user: User; token: string }> => {
  const requestBody = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    display_name: userData.displayName,
  };

  console.log('Attempting registration for user:', userData.username, 'with email:', userData.email);

  const response = await fetch(API_ROUTES.auth.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    credentials: 'include',
  });

  console.log('Registration response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log('Registration error response:', errorData);
    throw new Error(errorData.message || `Registration failed with status ${response.status}`);
  }

  const data: RegisterResponse = await response.json();
  console.log('Registration successful for user:', data.data.user.username);

  if (data.status !== 'success') {
    throw new Error(data.message || 'Registration failed.');
  }

  if (data.data.token) {
    document.cookie = `authToken=${data.data.token}; path=/; secure; samesite=strict; max-age=${24 * 60 * 60}`; // 24 hours
  }

  return data.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};