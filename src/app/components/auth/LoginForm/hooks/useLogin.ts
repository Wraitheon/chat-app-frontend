import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { LoginCredentials, LoginResponseData } from '@/types/auth.types';

const loginUser = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  return apiClient<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      setUser(data.user);

      console.log('Login successful. Invalidating auth-dependent queries...');

      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });

      router.push('/chat');
    },

    onError: (error) => {
      console.error('Login mutation failed:', error);
    },
  });
};