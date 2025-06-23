import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/apiClient';
import { LoginCredentials, LoginResponseData } from '@/types/auth.types';

const loginUser = async (credentials: LoginCredentials): Promise<LoginResponseData> => {
  return apiClient<LoginResponseData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: () => {
      console.log('Login successful. Invalidating auth-dependent queries...');

      queryClient.invalidateQueries({ queryKey: ['chats'] });

      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};