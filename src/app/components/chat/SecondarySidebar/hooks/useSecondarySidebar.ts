'use client';

import { useEffect, useMemo } from 'react';
import { useUserChats } from './useUserChat';
import { useMarkAsRead } from './useMarkAsRead';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { Chat } from '@/types/chat.types';

export const useSecondarySidebar = () => {
  const { data: chats, isLoading, isError, error } = useUserChats();
  const { mutate: markAsRead } = useMarkAsRead();
  const { socket, isConnected, onlineUsers } = useSocket();

  useEffect(() => {
    if (isConnected && socket && chats && chats.length > 0) {
      const userIdsToCheck = chats
        .filter(chat => chat.type === 'direct' && chat.other_member_id)
        .map(chat => chat.other_member_id!);

      if (userIdsToCheck.length > 0) {
        socket.emit('check_online_status', userIdsToCheck);
      }
    }
  }, [isConnected, socket, chats]);

  const groupChats = useMemo(
    () => chats?.filter(chat => chat.type === 'group'),
    [chats]
  );

  const directMessages = useMemo(
    () => chats?.filter(chat => chat.type === 'direct'),
    [chats]
  );

  const handleChannelClick = (chat: Chat) => {
    if (chat.unread_count && parseInt(chat.unread_count, 10) > 0) {
      markAsRead(chat.id);
    }
  };

  return {
    groupChats,
    directMessages,
    onlineUsers,
    isLoading,
    isError,
    error,
    handleChannelClick,
  };
};