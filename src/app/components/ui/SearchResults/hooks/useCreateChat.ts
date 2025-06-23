import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChat } from '@/app/services/chatService';

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};