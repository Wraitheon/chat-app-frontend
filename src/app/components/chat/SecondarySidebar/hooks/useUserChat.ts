import { useQuery } from '@tanstack/react-query';
import { fetchUserChats } from '@/app/services/chatService';

export const useUserChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchUserChats,
    refetchOnWindowFocus: false,
  });
};