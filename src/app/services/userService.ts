import { apiClient } from '@/app/lib/apiClient';
import { UsersData } from '@/types/user.types';

/**
 * Searches for users based on a query string.
 * @param query The search term.
 * @returns A promise that resolves to an array of User objects.
 */
export const searchUsers = async (query: string) => {
  if (!query.trim()) {
    // Don't make an API call for an empty query
    return [];
  }
  const data = await apiClient<UsersData>(`/users/?search=${query}`);
  return data.users;
};