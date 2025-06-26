import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createChatOrGroup } from '@/app/services/chatService';
import { CreateChatPayload, NewChatData } from '@/types/chat.types';

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChatPayload) => createChatOrGroup(payload),

    onSuccess: (data: NewChatData) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });

      if (data.type === 'group') {
        toast.success(`Group "${data.group_name}" created successfully!`);
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create chat.');
      console.error("Create chat error:", error);
    },
  });
};