import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markChatAsRead } from '@/app/services/chatService';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markChatAsRead,

    onSuccess: (variables) => {
      console.log(`Successfully marked chat ${variables} as read.`);
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },

    onError: (error) => {
      console.error("Failed to mark chat as read:", error);
    }
  });
};