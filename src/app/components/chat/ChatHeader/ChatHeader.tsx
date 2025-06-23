'use client';

import styles from './ChatHeader.module.scss';
import { HiOutlineUserGroup, HiOutlineInformationCircle } from 'react-icons/hi2';
import { ChatDetails } from '@/types/chat.types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ChatHeaderProps {
  chatDetails: ChatDetails | undefined;
  isLoading: boolean;
  onInfoClick: () => void;
}

const ChatHeader = ({ chatDetails, isLoading, onInfoClick }: ChatHeaderProps) => {
  if (isLoading) {
    return (
      <header className={styles.chatHeader}>
        <div className={styles.chatInfo}>
          <Skeleton circle width={40} height={40} />
          <div className={styles.chatName}>
            <Skeleton width={150} />
          </div>
        </div>
      </header>
    );
  }

  if (!chatDetails) return null;

  const isGroup = chatDetails.type === 'group';

  return (
    <header className={styles.chatHeader}>
      <div className={styles.chatInfo}>
        <div className={styles.avatar}>
          {isGroup ? <HiOutlineUserGroup size={20} /> : <img src="/assets/default-avatar.png" alt="avatar" />}
        </div>
        <div className={styles.chatName}>
          <h3>{isGroup ? chatDetails.group_name : 'Direct Message'}</h3>
          {isGroup && <p>{chatDetails.members.length} members</p>}
        </div>
      </div>
      <div className={styles.chatActions}>
        {isGroup && (
          <button onClick={onInfoClick} className={styles.infoButton} aria-label="View group info">
            <HiOutlineInformationCircle size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;