'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './SecondarySidebar.module.scss';
import { HiUserGroup, HiChatBubbleLeftRight, HiChevronRight } from 'react-icons/hi2';
import { useUserChats } from './hooks/useUserChat';
import { useMarkAsRead } from './hooks/useMarkAsRead';
import { useSocket } from '@/app/components/providers/SocketProvider';
import { Chat } from '@/types/chat.types';

interface SecondarySidebarProps {
  activeChatId: string | null;
}

const SecondarySidebar = ({ activeChatId }: SecondarySidebarProps) => {
  const { data: chats, isLoading, isError, error } = useUserChats();
  const { mutate: markAsRead } = useMarkAsRead();
  const { socket, isConnected, onlineUsers } = useSocket();

  const [isExpanded, setIsExpanded] = useState({
    groups: true,
    directMessages: true,
  });

  useEffect(() => {
    if (isConnected && socket && chats && chats.length > 0) {
      const userIdsToCheck = chats
        .filter(chat => chat.type === 'direct' && chat.other_member_id)
        .map(chat => chat.other_member_id!);

      if (userIdsToCheck.length > 0) {
        console.log('[SecondarySidebar] Emitting check_online_status for:', userIdsToCheck);
        socket.emit('check_online_status', userIdsToCheck);
      }
    }
  }, [isConnected, socket, chats]);

  const groupChats = chats?.filter(chat => chat.type === 'group');
  const directMessages = chats?.filter(chat => chat.type === 'direct');

  const handleChannelClick = (chat: Chat) => {
    if (parseInt(chat.unread_count, 10) > 0) {
      markAsRead(chat.id);
    }
  };

  const toggleCategory = (category: keyof typeof isExpanded) => {
    setIsExpanded(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const renderChannelLink = (chat: Chat) => {
    const displayName = chat.type === 'group' ? chat.group_name : chat.other_member_display_name;
    const icon = chat.type === 'group' ? <HiUserGroup size={20} /> : <HiChatBubbleLeftRight size={20} />;
    const isOnline = onlineUsers.has(chat.other_member_id!);

    return (
      <Link
        key={chat.id}
        href={`/chat/${chat.id}`}
        className={`${styles.channelLink} ${activeChatId === chat.id ? styles.active : ''}`}
        onClick={() => handleChannelClick(chat)}
      >
        <div className={styles.avatarContainer}>
          {icon}
          {chat.type === 'direct' && (
            <span className={`${styles.statusIndicator} ${isOnline ? styles.online : ''}`} />
          )}
        </div>

        <span className={styles.channelName}>{displayName}</span>
        {parseInt(chat.unread_count) > 0 && (
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
        {isError && <div className={styles.error}>{error.message}</div>}
        {chats && (
          <>
            <div className={styles.channelCategory}>
              <div className={`${styles.categoryHeader} ${isExpanded.groups ? styles.expanded : ''}`} onClick={() => toggleCategory('groups')}>
                <HiChevronRight size={16} />
                <h3>Groups</h3>
              </div>
              <div className={`${styles.collapsibleList} ${isExpanded.groups ? styles.expanded : ''}`}>
                {groupChats?.map(renderChannelLink)}
              </div>
            </div>
            <div className={styles.channelCategory}>
              <div className={`${styles.categoryHeader} ${isExpanded.directMessages ? styles.expanded : ''}`} onClick={() => toggleCategory('directMessages')}>
                <HiChevronRight size={16} />
                <h3>Direct Messages</h3>
              </div>
              <div className={`${styles.collapsibleList} ${isExpanded.directMessages ? styles.expanded : ''}`}>
                {directMessages?.map(renderChannelLink)}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default SecondarySidebar;