import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMemberToChat, removeMemberFromChat } from '@/app/services/chatService';
import { toast } from 'react-hot-toast'; // Assuming you have a toast library

export const useManageChatMembers = (chatId: string) => {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    // When a member is added or removed, refetch the chat details
    // to update the member list in the UI.
    queryClient.invalidateQueries({ queryKey: ['chatDetails', chatId] });
  };

  const addMemberMutation = useMutation({
    mutationFn: (userId: string) => addMemberToChat({ chatId, userId }),
    onSuccess: () => {
      onSuccess();
      toast.success("Member added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add member: ${error.message}`);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeMemberFromChat({ chatId, userId }),
    onSuccess: () => {
      onSuccess();
      toast.success("Member removed successfully.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove member: ${error.message}`);
    },
  });

  return {
    addMember: addMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,
    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
  };
};