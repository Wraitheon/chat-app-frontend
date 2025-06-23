'use client';

import { useState, useEffect } from 'react';
import styles from './ChatPanel.module.scss';
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

interface ChatPanelProps {
  activeChatId: string | null;
}

const ChatPanel = ({ activeChatId }: ChatPanelProps) => {
  const [isInfoPanelOpen, setInfoPanelOpen] = useState(false);
  const [isInfoPanelMounted, setInfoPanelMounted] = useState(false);

  const { data: messages, isLoading: isMessagesLoading, isError, error } = useChatMessages(activeChatId);
  const { data: chatDetails, isLoading: isDetailsLoading } = useChatDetails(activeChatId);

  const handleOpenPanel = () => {
    if (chatDetails) {
      setInfoPanelMounted(true);
    }
  };

  const handleClosePanel = () => {
    setInfoPanelOpen(false);

    setTimeout(() => {
      setInfoPanelMounted(false);
    }, 300);
  };

  useEffect(() => {
    if (isInfoPanelMounted) {
      const timer = setTimeout(() => {
        setInfoPanelOpen(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isInfoPanelMounted]);

  if (!activeChatId) {
    return (
      <main className={`${styles.chatPanel} ${styles.noChatSelected}`}>
        <div className={styles.placeholder}>
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
                  <img src={message.sender_display_picture_url || '/assets/default-avatar.png'} alt="avatar" />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageInfo}>
                    <strong>{message.sender_display_name}</strong>
                    <span className={styles.timestamp}>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p>{message.text_content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.messageInputWrapper}>
        <div className={styles.messageInput}>
          <div className={styles.toolbarTop}>
            <button><FaBold /></button>
            <button><FaItalic /></button>
            <button><FaLink /></button>
            <button><FaListUl /></button>
            <button><FaListOl /></button>
            <button><HiCodeBracket /></button>
          </div>
          <textarea placeholder={`Message ${chatDetails?.group_name || 'Direct Message'}`}></textarea>
          <div className={styles.toolbarBottom}>
            <div className={styles.leftActions}>
              <button><HiPlus size={20} /></button>
              <button><HiOutlineFaceSmile size={20} /></button>
              <button><HiOutlineVideoCamera size={20} /></button>
              <button><HiOutlineMicrophone size={20} /></button>
              <button><HiOutlinePaperClip size={20} /></button>
            </div>
            <button className={styles.sendButton}>
              <HiOutlinePaperAirplane size={20} />
            </button>
          </div>
        </div>
      </div>

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