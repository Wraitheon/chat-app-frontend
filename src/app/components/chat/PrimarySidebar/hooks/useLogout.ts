// app/hooks/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient';
import { useAuth } from '@/app/components/providers/AuthProvider';

const performLogout = async () => {
  return apiClient<void>('/auth/logout', {
    method: 'POST',
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: performLogout,
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries();
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
};