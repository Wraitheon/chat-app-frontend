import { useQuery } from '@tanstack/react-query';
import { fetchChatMessages } from '@/app/services/chatService';

export const useChatMessages = (chatId: string | null) => {
  return useQuery({
    queryKey: ['messages', chatId],

    queryFn: () => fetchChatMessages(chatId!),

    enabled: !!chatId,
  });
};