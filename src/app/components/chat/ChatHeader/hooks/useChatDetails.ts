import { useQuery } from '@tanstack/react-query';
import { fetchChatDetails } from '@/app/services/chatService';

export const useChatDetails = (chatId: string | null) => {
  return useQuery({
    queryKey: ['chatDetails', chatId],
    queryFn: () => fetchChatDetails(chatId!),
    enabled: !!chatId,
    // Optional: Add staleTime to avoid refetching too often
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};