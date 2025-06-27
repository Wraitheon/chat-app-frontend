import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { API_ROUTES } from '@/app/lib/apiRoutes';
import { RegisterResponse, RegistrationData } from '@/types/auth.types';
import { User } from '@/types/user.types';

const registerUser = async (userData: RegistrationData): Promise<{ user: User; token: string }> => {
  const requestBody = {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    display_name: userData.displayName,
  };

  const response = await fetch(API_ROUTES.auth.register, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    credentials: 'include',
  });

  const data: RegisterResponse = await response.json();

  if (!response.ok || data.status !== 'success') {
    console.log('Registration failed:', data);
    const errorMessage = data.message || 'Registration failed.';
    throw new Error(errorMessage);
  }

  return data.data;
};

export const useRegister = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser(data.user);

      toast.success(`Welcome, ${data.user.display_name}! You are now logged in.`);

      router.push('/chat');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};