'use client';

import styles from './ChatPanel.module.scss';
import Image from 'next/image';
import {
  HiOutlinePaperAirplane, HiOutlinePaperClip, HiOutlineVideoCamera,
  HiOutlineMicrophone, HiOutlineFaceSmile, HiPlus, HiCodeBracket, HiXCircle
} from 'react-icons/hi2';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink } from 'react-icons/fa';
import { Message } from '@/types/message.types';

import ChatHeader from '../ChatHeader/ChatHeader';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatDetails } from '../ChatHeader/hooks/useChatDetails';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import { useEffect, useRef, useState } from 'react';

interface TypingUser {
  id: string;
  display_name: string;
}

interface ChatPanelProps {
  activeChatId: string | null;
  setCurrentPanel: (panel: "chat" | "user" | null) => void;
}

const ChatPanel = ({ activeChatId, setCurrentPanel }: ChatPanelProps) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [messageText, setMessageText] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const { data: messages, isLoading: isMessagesLoading, isError, error } = useChatMessages(activeChatId);
  const { data: chatDetails, isLoading: isDetailsLoading } = useChatDetails(activeChatId);

  useEffect(() => {
    if (!socket || !isConnected || !activeChatId) return;
    socket.emit('join_room', activeChatId);
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chat_id === activeChatId) {
        queryClient.setQueryData(['messages', activeChatId], (oldData: Message[] | undefined) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        });
      }
    };
    const handleUserTyping = (data: { chat_id: string, user: TypingUser }) => {
      if (data.chat_id === activeChatId) {
        setTypingUsers(prev => !prev.find(u => u.id === data.user.id) ? [...prev, data.user] : prev);
      }
    };
    const handleUserStoppedTyping = (data: { chat_id: string, user: { id: string } }) => {
      if (data.chat_id === activeChatId) {
        setTypingUsers(prev => prev.filter(u => u.id !== data.user.id));
      }
    };
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stopped_typing', handleUserStoppedTyping);
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stopped_typing', handleUserStoppedTyping);
    };
  }, [socket, isConnected, activeChatId, queryClient]);

  useEffect(() => { setTypingUsers([]); }, [activeChatId]);
  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (socket && activeChatId) {
      socket.emit('stop_typing', { chat_id: activeChatId });
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    const hasText = messageText.trim().length > 0;
    const hasImage = !!imagePreviewUrl;

    if ((hasText || hasImage) && socket && activeChatId) {
      stopTyping();

      const payload = {
        chat_id: activeChatId,
        text_content: hasText ? messageText.trim() : undefined,
        image_data_url: hasImage ? imagePreviewUrl : undefined,
      };

      console.log('[CLIENT] Emitting "send_message" with payload:', payload);
      socket.emit('send_message', payload);

      setMessageText('');
      setImagePreviewUrl(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    if (!socket || !activeChatId) return;
    if (!typingTimeoutRef.current) {
      socket.emit('start_typing', { chat_id: activeChatId });
    } else {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => { stopTyping(); }, 3000);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select a file smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read file.');
    };
    e.target.value = '';
  };

  const getTypingMessage = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].display_name} is typing...`;
    return 'Several people are typing...';
  };

  if (!activeChatId) {
    return (
      <main className={`${styles.chatPanel} ${styles.noChatSelected}`}>
      </main>
    );
  }

  return (
    <main className={styles.chatPanel}>
      <ChatHeader chatDetails={chatDetails} isLoading={isDetailsLoading} onInfoClick={() => setCurrentPanel("chat")} />

      <div className={styles.messageArea}>
        {isMessagesLoading && <div>Loading messages...</div>}
        {isError && <div>Error: {error.message}</div>}
        {messages && (
          <div className={styles.messageList}>
            {messages.map((message: Message) => (
              <div key={message.id} className={styles.messageItem}>
                <div className={styles.avatar}>
                  <img src={getDisplayPictureUrl(message.sender_display_picture_url)} alt="avatar" />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageInfo}>
                    <strong>{message.sender_display_name}</strong>
                    <span className={styles.timestamp}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {message.image_data_url ? (
                    <img src={message.image_data_url} alt="User upload" className={styles.chatImage} />
                  ) : (
                    <p>{message.text_content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <div className={styles.typingIndicator}>{getTypingMessage()}</div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
      />

      <form className={styles.messageInputWrapper} onSubmit={handleSendMessage}>
        <div className={styles.messageInput}>
          {imagePreviewUrl && (
            <div className={styles.imagePreviewContainer}>
              <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => setImagePreviewUrl(null)}
                aria-label="Remove image"
              >
                <HiXCircle size={24} />
              </button>
            </div>
          )}

          <div className={styles.toolbarTop}>
            <button type="button"><FaBold /></button>
            <button type="button"><FaItalic /></button>
          </div>
          <textarea
            placeholder={imagePreviewUrl ? 'Add a caption...' : `Message ${chatDetails?.group_name || 'Direct Message'}`}
            value={messageText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.toolbarBottom}>
            <div className={styles.leftActions}>
              <button type="button"><HiPlus size={20} /></button>
              <button type="button"><HiOutlineFaceSmile size={20} /></button>
              <button type="button" onClick={handleAttachClick}>
                <HiOutlinePaperClip size={20} />
              </button>
            </div>
            <button type="submit" className={styles.sendButton}>
              <HiOutlinePaperAirplane size={20} />
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ChatPanel;