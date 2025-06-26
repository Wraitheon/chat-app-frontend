'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UserInfoPanel.module.scss';
import Panel from '../../ui/Panel/Panel';
import EditUserInfoModal from '../../ui/EditUserInfoModal/EditUserInfoModal';
import { HiPencil, HiChatBubbleLeftRight } from 'react-icons/hi2';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import { User } from '@/types/user.types';
import { useCreateChat } from '@/app/hooks/useCreateChat';

interface UserInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: User;
  onUserUpdate: () => void;
}

const UserInfoPanel = ({ isOpen, onClose, userDetails, onUserUpdate }: UserInfoPanelProps) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { mutate: createChat, isPending: isCreatingChat } = useCreateChat();

  const canEditProfile = currentUser?.id === userDetails.id;

  const handleUpdateSuccess = () => {
    setEditModalOpen(false);
    onUserUpdate();
  };

  const handleStartDm = () => {
    if (isCreatingChat) return;
    createChat(
      { members: [userDetails.id] },
      {
        onSuccess: (newChat) => {
          onClose();
          router.push(`/chat/${newChat.id}`);
        },
      }
    );
  };

  const panelHeaderActions = canEditProfile ? (
    <button
      className={styles.editButton}
      onClick={() => setEditModalOpen(true)}
      aria-label="Edit user profile"
    >
      <HiPencil size={18} />
    </button>
  ) : null;

  const panelFooter = !canEditProfile ? (
    <button
      className={styles.actionButton}
      onClick={handleStartDm}
      disabled={isCreatingChat}
    >
      <HiChatBubbleLeftRight size={20} />
      <span>{isCreatingChat ? 'Starting Chat...' : 'Message'}</span>
    </button>
  ) : null;

  return (
    <>
      {canEditProfile && (
        <EditUserInfoModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          currentUserDetails={userDetails}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      <Panel
        isOpen={isOpen}
        onClose={onClose}
        className={styles.userInfoPanel}
        title="User Profile"
        headerActions={panelHeaderActions}
        footer={panelFooter}
      >
        <div className={styles.profileHeader}>
          <img
            src={getDisplayPictureUrl(userDetails.display_picture_url)}
            alt={`${userDetails.display_name}'s avatar`}
            className={styles.profileAvatar}
          />
          <h4 className={styles.displayName}>{userDetails.display_name}</h4>
          <p className={styles.username}>@{userDetails.username}</p>
        </div>

        {userDetails.status_message && (
          <div className={styles.statusMessage}>
            <p>{userDetails.status_message}</p>
          </div>
        )}

        <ul className={styles.userInfoList}>
          <li className={styles.infoItem}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{userDetails.email}</span>
          </li>
        </ul>
      </Panel>
    </>
  );
};

export default UserInfoPanel;