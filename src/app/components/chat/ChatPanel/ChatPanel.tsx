'use client';

import { useState, useEffect } from 'react';
import styles from './ChatPanel.module.scss';
import { HiOutlinePaperAirplane, HiOutlinePaperClip, HiOutlineFaceSmile, HiPlus, HiXCircle } from 'react-icons/hi2';
import { FaBold, FaItalic } from 'react-icons/fa';
import { Message } from '@/types/message.types';
import ChatHeader from '../ChatHeader/ChatHeader';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import { useChatPanelManager } from './hooks/useChatPanelManager';

interface ChatPanelProps {
  activeChatId: string | null;
  setCurrentPanel: (panel: "chat" | "user" | null) => void;
}

const ChatPanel = ({ activeChatId, setCurrentPanel }: ChatPanelProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    messages,
    chatDetails,
    isMessagesLoading,
    isDetailsLoading,
    isError,
    error,
    typingMessage,
    messageEndRef,
    messageText,
    imagePreviewUrl,
    fileInputRef,
    handleSendMessage,
    handleKeyDown,
    handleInputChange,
    handleAttachClick,
    handleFileChange,
    removeImagePreview,
  } = useChatPanelManager({ activeChatId });

  if (!isMounted) {
    return (
      <main className={`${styles.chatPanel} ${styles.noChatSelected}`}>
      </main>
    );
  }
  if (!activeChatId) {
    return (
      <main className={`${styles.chatPanel} ${styles.noChatSelected}`}>
        <div className={styles.placeholder}>
          <h2>Select a chat to start messaging</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.chatPanel}>
      <ChatHeader
        chatDetails={chatDetails}
        isLoading={isDetailsLoading}
        onInfoClick={() => setCurrentPanel("chat")}
      />

      <div className={styles.messageArea}>
        {isMessagesLoading && <div className={styles.loading}>Loading messages...</div>}
        {isError && <div className={styles.error}>Error: {error?.message}</div>}
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
                    <span className={styles.timestamp}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {message.text_content && <p>{message.text_content}</p>}
                  {message.image_data_url && (
                    <img src={message.image_data_url} alt="User upload" className={styles.chatImage} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      <div className={styles.typingIndicator}>{typingMessage}</div>

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
                onClick={removeImagePreview}
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
            rows={1}
          />
          <div className={styles.toolbarBottom}>
            <div className={styles.leftActions}>
              <button type="button"><HiPlus size={20} /></button>
              <button type="button"><HiOutlineFaceSmile size={20} /></button>
              <button type="button" onClick={handleAttachClick}>
                <HiOutlinePaperClip size={20} />
              </button>
            </div>
            <button type="submit" className={styles.sendButton} disabled={!messageText.trim() && !imagePreviewUrl}>
              <HiOutlinePaperAirplane size={20} />
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ChatPanel;