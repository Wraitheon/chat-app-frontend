import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchUsers } from '@/app/components/ui/SearchResults/hooks/useSearchUsers';
import { useCreateChat } from '@/app/hooks/useCreateChat';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { User } from '@/types/user.types';
import { CreateChatPayload } from '@/types/chat.types';

export const useCreateGroupChatForm = (onClose: () => void) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchTerm);
  const { mutate: createChat, isPending: isCreating } = useCreateChat();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!groupAvatarFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(groupAvatarFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [groupAvatarFile]);

  const handleSelectUser = (user: User) => {
    if (user.id === currentUser?.id || selectedUsers.some(su => su.id === user.id)) {
      return;
    }
    setSelectedUsers(prev => [...prev, user]);
    setSearchTerm('');
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const resetState = useCallback(() => {
    setGroupName('');
    setGroupAvatarFile(null);
    setPreviewUrl(null);
    setSelectedUsers([]);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) return;

    const payload: CreateChatPayload = {
      group_name: groupName.trim(),
      members: selectedUsers.map(u => u.id),
      group_avatar: groupAvatarFile,
    };

    createChat(payload, {
      onSuccess: (newChat) => {
        handleClose();
        router.push(`/chat/${newChat.id}`);
      },
    });
  };

  return {
    groupName,
    groupAvatarFile,
    previewUrl,
    selectedUsers,
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    isSearching,
    isCreating,
    setGroupName,
    setGroupAvatarFile,
    setSearchTerm,
    handleSelectUser,
    handleRemoveUser,
    handleSubmit,
    handleClose,
  };
};