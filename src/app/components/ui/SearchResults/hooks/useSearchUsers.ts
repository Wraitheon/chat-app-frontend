import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/app/services/userService';

export const useSearchUsers = (searchQuery: string) => {
  return useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 1000 * 60,
  });
};