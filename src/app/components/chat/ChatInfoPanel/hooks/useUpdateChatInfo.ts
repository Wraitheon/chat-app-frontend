import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateChatDetails } from '@/app/services/chatService';
import { toast } from 'react-hot-toast';
import { NewChatData } from '@/types/chat.types';

type UpdateChatPayload = {
  chatId: string;
  formData: FormData;
  group_name?: string;
};

export const useUpdateChatInfo = () => {
  const queryClient = useQueryClient();

  return useMutation<NewChatData, Error, UpdateChatPayload>({
    mutationFn: updateChatDetails,
    onSuccess: (_data, variables) => {
      toast.success('Group info updated successfully!');

      queryClient.invalidateQueries({ queryKey: ['chatDetails', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update group info.');
      console.error('Update chat error:', error);
    },
  });
};
