'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/types/message.types';

interface TypingUser {
  id: string;
  display_name: string;
}

export const useChatSocket = (activeChatId: string | null) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    if (newMessage.chat_id === activeChatId) {
      queryClient.setQueryData(['messages', activeChatId], (oldData: Message[] | undefined) => {
        if (!oldData) return [newMessage];
        return [...oldData, newMessage];
      });
    }
  }, [activeChatId, queryClient]);

  const handleUserTyping = useCallback((data: { chat_id: string, user: TypingUser }) => {
    if (data.chat_id === activeChatId) {
      setTypingUsers(prev =>
        !prev.find(u => u.id === data.user.id) ? [...prev, data.user] : prev
      );
    }
  }, [activeChatId]);

  const handleUserStoppedTyping = useCallback((data: { chat_id: string, user: { id: string } }) => {
    if (data.chat_id === activeChatId) {
      setTypingUsers(prev => prev.filter(u => u.id !== data.user.id));
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!socket || !isConnected || !activeChatId) return;

    socket.emit('join_room', activeChatId);
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [socket, isConnected, activeChatId, handleNewMessage, handleUserTyping, handleUserStoppedTyping]);

  useEffect(() => {
    setTypingUsers([]);
  }, [activeChatId]);

  return { typingUsers };
};