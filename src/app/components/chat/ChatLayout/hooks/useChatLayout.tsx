import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { useChatDetails } from '../../ChatHeader/hooks/useChatDetails';
import { useCreateChat } from '@/app/hooks/useCreateChat';
import { User } from '@/types/user.types';
import { CreateChatPayload } from '@/types/chat.types';

export const useChatLayout = (initialActiveChatId: string | null = null) => {
  // State Management
  const [activeChatId, setActiveChatId] = useState<string | null>(initialActiveChatId);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<"user" | "chat" | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { data: chatDetails } = useChatDetails(activeChatId);
  const { mutate: createNewChat, isPending: isCreatingChat } = useCreateChat();

  useEffect(() => {
    if (activeChatId) {
      setSearchTerm('');
    }
  }, [activeChatId]);

  const handleUserUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  const handleChatUpdate = () => {
    if (activeChatId) {
      queryClient.invalidateQueries({ queryKey: ['chatDetails', activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  };

  const handleResultClick = () => {
    setSearchTerm('');
  };

  const handleUserSelect = (user: User) => {
    if (isCreatingChat) return;

    const payload: CreateChatPayload = { members: [user.id] };

    createNewChat(payload, {
      onSuccess: (newChat) => {
        router.push(`/chat/${newChat.id}`);
        handleResultClick();
      },
    });
  };

  return {
    activeChatId,
    searchTerm,
    isGroupModalOpen,
    currentPanel,
    currentUser,
    chatDetails,
    setSearchTerm,
    setCurrentPanel,
    openGroupModal: () => setGroupModalOpen(true),
    closeGroupModal: () => setGroupModalOpen(false),
    openUserPanel: () => setCurrentPanel('user'),
    openChatPanel: () => setCurrentPanel('chat'),
    closePanel: () => setCurrentPanel(null),
    handleUserUpdate,
    handleChatUpdate,
    handleResultClick,
    handleUserSelect,
  };
};