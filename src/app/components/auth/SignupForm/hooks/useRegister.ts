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
  message?: string;
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

  const data: RegisterResponse = await response.json();

  if (!response.ok || data.status !== 'success') {
    console.log('Registration failed:', data);
    const errorMessage = data.message || 'Registration failed.';
    throw new Error(errorMessage);
  }

  console.log('Registration successful for user:', data.data.user.username);

  return data.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};