// app/hooks/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/app/lib/apiClient'; // Import our fixed client
import { useAuth } from '@/app/components/providers/AuthProvider';

// The logout function now uses our robust apiClient
const performLogout = async () => {
  // We just need to provide the endpoint. apiClient handles the rest.
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
      // Clear client-side state
      setUser(null);
      // Invalidate all queries to remove any cached user data
      queryClient.invalidateQueries();
      // Redirect to the login page, where middleware will now allow access
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // You could implement an error toast here for the user
    },
  });
};