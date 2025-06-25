'use-client';

import styles from './ChatHeader.module.scss';
import { HiOutlineUserGroup, HiOutlineInformationCircle } from 'react-icons/hi2';
import { ChatDetails } from '@/types/chat.types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import { useAuth } from '@/app/components/providers/AuthProvider'; // We need this for DMs

interface ChatHeaderProps {
  chatDetails: ChatDetails | undefined;
  isLoading: boolean;
  onInfoClick: () => void;
}

const ChatHeader = ({ chatDetails, isLoading, onInfoClick }: ChatHeaderProps) => {
  const { user: currentUser } = useAuth();

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

  if (!chatDetails || !currentUser) return null;

  const isGroup = chatDetails.type === 'group';

  let avatarContent;
  let chatName;
  let chatSubtext;

  if (isGroup) {
    chatName = chatDetails.group_name;
    chatSubtext = `${chatDetails.members.length} members`;

    if (chatDetails.group_avatar_url) {
      avatarContent = <img src={getDisplayPictureUrl(chatDetails.group_avatar_url)} alt={`${chatDetails.group_name} avatar`} />;
    } else {
      avatarContent = <div className={styles.iconWrapper}><HiOutlineUserGroup size={24} /></div>;
    }
  } else {
    const otherMember = chatDetails.members.find(member => member.id !== currentUser.id);

    chatName = otherMember?.display_name || 'Direct Message';
    chatSubtext = null;

    avatarContent = <img src={getDisplayPictureUrl(otherMember?.display_picture_url)} alt={`${otherMember?.display_name || 'User'} avatar`} />;
  }

  return (
    <header className={styles.chatHeader}>
      <div className={styles.chatInfo}>
        <div className={styles.avatar}>
          {avatarContent}
        </div>
        <div className={styles.chatName}>
          <h3>{chatName}</h3>
          {chatSubtext && <p>{chatSubtext}</p>}
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