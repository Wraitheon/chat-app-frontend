// app/components/chat/SecondarySidebar/SecondarySidebar.tsx

'use client';

import Link from 'next/link';
import styles from './SecondarySidebar.module.scss';
import { HiUserGroup, HiChatBubbleLeftRight, HiChevronRight } from 'react-icons/hi2';
import { useUserChats } from './hooks/useUserChat';
import { useMarkAsRead } from './hooks/useMarkAsRead';
import { Chat } from '@/types/chat.types';

interface SecondarySidebarProps {
  activeChatId: string | null;
}

const SecondarySidebar = ({ activeChatId }: SecondarySidebarProps) => {
  const { data: chats, isLoading, isError, error } = useUserChats();
  const { mutate: markAsRead } = useMarkAsRead();

  const groupChats = chats?.filter(chat => chat.type === 'group');
  const directMessages = chats?.filter(chat => chat.type === 'direct');

  const handleChannelClick = (chat: Chat) => {
    if (parseInt(chat.unread_count, 10) > 0) {
      markAsRead(chat.id);
    }
  };

  const renderChannelLink = (chat: Chat) => {
    const displayName = chat.type === 'group' ? chat.group_name : chat.other_member_display_name;
    const icon = chat.type === 'group' ? <HiUserGroup size={20} /> : <HiChatBubbleLeftRight size={20} />;

    return (
      <Link
        key={chat.id}
        href={`/chat/${chat.id}`}
        className={`${styles.channelLink} ${activeChatId === chat.id ? styles.active : ''}`}
        onClick={() => handleChannelClick(chat)}
      >
        {icon}
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
              <div className={styles.categoryHeader}>
                <HiChevronRight size={16} />
                <h3>Groups</h3>
              </div>
              {groupChats?.map(renderChannelLink)}
            </div>
            <div className={styles.channelCategory}>
              <div className={styles.categoryHeader}>
                <HiChevronRight size={16} />
                <h3>Direct Messages</h3>
              </div>
              {directMessages?.map(renderChannelLink)}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default SecondarySidebar;