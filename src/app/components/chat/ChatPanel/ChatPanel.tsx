'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ChatPanel.module.scss';
import Image from 'next/image';
import {
  HiOutlinePaperAirplane, HiOutlinePaperClip, HiOutlineVideoCamera,
  HiOutlineMicrophone, HiOutlineFaceSmile, HiPlus, HiCodeBracket
} from 'react-icons/hi2';
import { FaBold, FaItalic, FaListUl, FaListOl, FaLink } from 'react-icons/fa';
import { Message } from '@/types/message.types';

import ChatHeader from '../ChatHeader/ChatHeader';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatDetails } from '../ChatHeader/hooks/useChatDetails';
import ChatInfoPanel from '../ChatInfoPanel/ChatInfoPanel';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';

interface ChatPanelProps {
  activeChatId: string | null;
}

const ChatPanel = ({ activeChatId }: ChatPanelProps) => {
  // --- HOOKS & STATE ---
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const [messageText, setMessageText] = useState('');
  const [isInfoPanelOpen, setInfoPanelOpen] = useState(false);
  const [isInfoPanelMounted, setInfoPanelMounted] = useState(false);

  const { data: messages, isLoading: isMessagesLoading, isError, error } = useChatMessages(activeChatId);
  const { data: chatDetails, isLoading: isDetailsLoading } = useChatDetails(activeChatId);

  // --- SOCKET.IO REAL-TIME LOGIC ---
  useEffect(() => {
    // We need an active socket connection and a selected chat to proceed.
    if (!socket || !isConnected || !activeChatId) return;

    // 1. Join the room for the active chat to receive messages.
    socket.emit('join_room', activeChatId);
    console.log(`Socket joined room: ${activeChatId}`);

    // 2. Set up a listener for new messages.
    const handleNewMessage = (newMessage: Message) => {
      // Check if the incoming message belongs to the currently active chat.
      if (newMessage.chat_id === activeChatId) {
        // This is the best practice: update the React Query cache directly.
        // It provides an instant UI update without needing a re-fetch.
        queryClient.setQueryData(['messages', activeChatId], (oldData: Message[] | undefined) => {
          if (!oldData) return [newMessage];
          return [...oldData, newMessage];
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    // 3. CRUCIAL: Clean up the listener when the component unmounts
    // or when the user switches to a different chat.
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, activeChatId, queryClient]); // Re-run this logic if any of these change.

  // --- AUTO-SCROLLING ---
  useEffect(() => {
    // Automatically scroll to the bottom whenever new messages are added.
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- UI EVENT HANDLERS ---
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent form submission from reloading the page
    if (messageText.trim() && socket && activeChatId) {
      // Emit the event to the server, just like we did in Postman.
      socket.emit('send_message', {
        chat_id: activeChatId,
        text_content: messageText,
      });
      setMessageText(''); // Clear the input field
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on "Enter" but allow new lines with "Shift + Enter"
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenPanel = () => {
    setInfoPanelMounted(true);
    setTimeout(() => setInfoPanelOpen(true), 10);
  };

  const handleClosePanel = () => {
    setInfoPanelOpen(false);
    setTimeout(() => setInfoPanelMounted(false), 300);
  };

  useEffect(() => {
    // Panel animation effect
    if (isInfoPanelMounted && !isInfoPanelOpen) {
      const timer = setTimeout(() => setInfoPanelMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isInfoPanelMounted, isInfoPanelOpen]);

  if (!activeChatId) {
    return (
      <main className={`${styles.chatPanel} ${styles.noChatSelected}`}>
        <div className={styles.placeholder}>
          <Image
            src="/assets/splashscreen.svg"
            alt="Illustration of global communication"
            width={700}
            height={500}
            priority
          />
          <h2>Select a chat to start messaging</h2>
          <p>Choose a conversation from the sidebar or search for a user.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.chatPanel}>
      <ChatHeader
        chatDetails={chatDetails}
        isLoading={isDetailsLoading}
        onInfoClick={handleOpenPanel}
      />

      <div className={styles.messageArea}>
        {isMessagesLoading && <div>Loading messages...</div>}
        {isError && <div>Error: {error.message}</div>}
        {messages && (
          <div className={styles.messageList}>
            {messages.map((message: Message) => (
              <div key={message.id} className={styles.messageItem}>
                <div className={styles.avatar}>
                  <img
                    src={getDisplayPictureUrl(message.sender_display_picture_url)}
                    alt="avatar"
                  />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageInfo}>
                    <strong>{message.sender_display_name}</strong>
                    <span className={styles.timestamp}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p>{message.text_content}</p>
                </div>
              </div>
            ))}
            {/* This empty div is the target for our auto-scroll */}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <form className={styles.messageInputWrapper} onSubmit={handleSendMessage}>
        <div className={styles.messageInput}>
          <div className={styles.toolbarTop}>
            <button type="button"><FaBold /></button>
            <button type="button"><FaItalic /></button>
            <button type="button"><FaLink /></button>
            <button type="button"><FaListUl /></button>
            <button type="button"><FaListOl /></button>
            <button type="button"><HiCodeBracket /></button>
          </div>
          <textarea
            placeholder={`Message ${chatDetails?.group_name || 'Direct Message'}`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.toolbarBottom}>
            <div className={styles.leftActions}>
              <button type="button"><HiPlus size={20} /></button>
              <button type="button"><HiOutlineFaceSmile size={20} /></button>
              <button type="button"><HiOutlineVideoCamera size={20} /></button>
              <button type="button"><HiOutlineMicrophone size={20} /></button>
              <button type="button"><HiOutlinePaperClip size={20} /></button>
            </div>
            <button type="submit" className={styles.sendButton}>
              <HiOutlinePaperAirplane size={20} />
            </button>
          </div>
        </div>
      </form>

      {isInfoPanelMounted && chatDetails && (
        <ChatInfoPanel
          isOpen={isInfoPanelOpen}
          onClose={handleClosePanel}
          chatDetails={chatDetails}
        />
      )}
    </main>
  );
};

export default ChatPanel;