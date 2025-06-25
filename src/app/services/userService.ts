import { apiClient } from '@/app/lib/apiClient';
import { User } from '@/types/user.types';
import { API_ROUTES } from '../lib/apiRoutes';

export const searchUsers = async (query: string): Promise<User[]> => {
  if (!query.trim()) {
    return [];
  }

  const endpoint = API_ROUTES.users.search(query);

  return await apiClient<User[]>(endpoint);
};

export const getUser = async (): Promise<User> => {
  const endpoint = API_ROUTES.users.getUser;
  return await apiClient<User>(endpoint);
}

export const updateUserDetails = async (payload: {
  display_name?: string;
  profile_picture?: string;
}): Promise<User> => {
  const endpoint = API_ROUTES.users.updateUser;

  return await apiClient<User>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}