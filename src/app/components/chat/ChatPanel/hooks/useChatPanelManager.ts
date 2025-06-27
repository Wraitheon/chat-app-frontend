'use client';

import { useRef, useEffect } from 'react';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { useChatMessages } from './useChatMessages';
import { useChatDetails } from '../../ChatHeader/hooks/useChatDetails';
import { useChatSocket } from './useChatSocket';
import { useChatMessageInput } from './useChatMessageInput';

interface UseChatPanelManagerProps {
  activeChatId: string | null;
}

export const useChatPanelManager = ({ activeChatId }: UseChatPanelManagerProps) => {
  const { socket } = useSocket();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const { data: messages, isLoading: isMessagesLoading, isError, error } = useChatMessages(activeChatId);
  const { data: chatDetails, isLoading: isDetailsLoading } = useChatDetails(activeChatId);

  const { typingUsers } = useChatSocket(activeChatId);

  const sendMessage = (payload: { text_content?: string, image_data_url?: string }) => {
    if (socket && activeChatId) {
      socket.emit('send_message', { chat_id: activeChatId, ...payload });
    }
  };

  const startTyping = () => {
    if (socket && activeChatId) {
      socket.emit('start_typing', { chat_id: activeChatId });
    }
  };

  const stopTyping = () => {
    if (socket && activeChatId) {
      socket.emit('stop_typing', { chat_id: activeChatId });
    }
  };

  const inputManager = useChatMessageInput({
    onSendMessage: sendMessage,
    onStartTyping: startTyping,
    onStopTyping: stopTyping,
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTypingMessage = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].display_name} is typing...`;
    return 'Several people are typing...';
  };
  const typingMessage = getTypingMessage();

  return {
    messages,
    chatDetails,
    isMessagesLoading,
    isDetailsLoading,
    isError,
    error,
    typingMessage,
    messageEndRef,
    ...inputManager,
  };
};