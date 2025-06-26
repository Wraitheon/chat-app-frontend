import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserDetails } from '@/app/services/userService';
import { toast } from 'react-hot-toast';

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserDetails,

    onSuccess: () => {
      toast.success('Profile updated successfully!');

      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile.');
      console.error("Update user info error:", error);
    },
  });
};