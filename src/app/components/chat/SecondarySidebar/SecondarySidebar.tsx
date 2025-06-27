'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './SecondarySidebar.module.scss';
import { HiUserGroup, HiChatBubbleLeftRight, HiChevronRight } from 'react-icons/hi2';
import { useSecondarySidebar } from './hooks/useSecondarySidebar';
import { Chat } from '@/types/chat.types';

interface SecondarySidebarProps {
  activeChatId: string | null;
}

const SecondarySidebar = ({ activeChatId }: SecondarySidebarProps) => {
  // The component now only manages its own view state.
  const [isExpanded, setIsExpanded] = useState({
    groups: true,
    directMessages: true,
  });

  // All complex logic is now neatly encapsulated in this hook.
  const {
    groupChats,
    directMessages,
    onlineUsers,
    isLoading,
    isError,
    error,
    handleChannelClick,
  } = useSecondarySidebar();

  const toggleCategory = (category: keyof typeof isExpanded) => {
    setIsExpanded(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  // This render function remains in the component as it's purely for presentation.
  const renderChannelLink = (chat: Chat) => {
    const displayName = chat.type === 'group' ? chat.group_name : chat.other_member_display_name;
    const isOnline = chat.type === 'direct' && onlineUsers.has(chat.other_member_id!);

    return (
      <Link
        key={chat.id}
        href={`/chat/${chat.id}`}
        className={`${styles.channelLink} ${activeChatId === chat.id ? styles.active : ''}`}
        onClick={() => handleChannelClick(chat)}
      >
        <div className={styles.avatarContainer}>
          {chat.type === 'group' ? <HiUserGroup size={20} /> : (
            <>
              <HiChatBubbleLeftRight size={20} />
              <span className={`${styles.statusIndicator} ${isOnline ? styles.online : ''}`} />
            </>
          )}
        </div>

        <span className={styles.channelName}>{displayName}</span>
        {parseInt(chat.unread_count, 10) > 0 && (
          <span className={styles.unreadBadge}>{chat.unread_count}</span>
        )}
      </Link>
    );
  };

  return (
    <aside className={styles.secondarySidebar}>
      <header className={styles.header}>
        <h2>QLU Recruiting</h2>
      </header>
      <div className={styles.channelList}>
        {isLoading && <div className={styles.loading}>Loading chats...</div>}
        {isError && <div className={styles.error}>{error?.message}</div>}

        {/* Render only when data is available */}
        {groupChats && directMessages && (
          <>
            <div className={styles.channelCategory}>
              <div className={`${styles.categoryHeader} ${isExpanded.groups ? styles.expanded : ''}`} onClick={() => toggleCategory('groups')}>
                <HiChevronRight size={16} />
                <h3>Groups</h3>
              </div>
              <div className={`${styles.collapsibleList} ${isExpanded.groups ? styles.expanded : ''}`}>
                {groupChats.map(renderChannelLink)}
              </div>
            </div>
            <div className={styles.channelCategory}>
              <div className={`${styles.categoryHeader} ${isExpanded.directMessages ? styles.expanded : ''}`} onClick={() => toggleCategory('directMessages')}>
                <HiChevronRight size={16} />
                <h3>Direct Messages</h3>
              </div>
              <div className={`${styles.collapsibleList} ${isExpanded.directMessages ? styles.expanded : ''}`}>
                {directMessages.map(renderChannelLink)}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default SecondarySidebar;