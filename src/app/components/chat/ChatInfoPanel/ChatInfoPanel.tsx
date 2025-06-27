'use client';

import { useState } from 'react';
import styles from './ChatInfoPanel.module.scss';
import Panel from '../../ui/Panel/Panel';
import { HiUserPlus, HiUserMinus, HiPencil } from 'react-icons/hi2';
import { ChatDetails } from '@/types/chat.types';
import { useManageChatMembers } from './hooks/useManageChatMembers';
import AddMemberModal from '../../ui/AddMemberModal/AddMemberModal';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import EditGroupInfoModal from '../../ui/EditGroupInfoModal/EditGroupInfoModal';
import { Toaster } from 'react-hot-toast';

interface ChatInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chatDetails: ChatDetails;
  onChatUpdate: () => void;
}

const ChatInfoPanel = ({ isOpen, onClose, chatDetails, onChatUpdate }: ChatInfoPanelProps) => {
  const { user: currentUser } = useAuth();
  const { removeMember, isRemovingMember } = useManageChatMembers(chatDetails.id);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const canManageMembers = currentUser?.id === chatDetails.creator_id;

  const handleRemoveMember = (userId: string) => {
    removeMember(userId);
  };

  const handleUpdateSuccess = () => {
    setEditModalOpen(false);
    onChatUpdate();
  };

  const panelHeaderActions = canManageMembers ? (
    <button
      className={styles.editButton}
      onClick={() => setEditModalOpen(true)}
      aria-label="Edit group info"
    >
      <HiPencil size={18} />
    </button>
  ) : null;

  return (
    <>
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        chatId={chatDetails.id}
        currentMembers={chatDetails.members}
      />

      <EditGroupInfoModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        chatDetails={chatDetails}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <Panel
        isOpen={isOpen}
        onClose={onClose}
        title="Group Info"
        headerActions={panelHeaderActions}
        className={styles.chatInfoPanel}
      >
        <div className={styles.groupMeta}>
          <img
            src={getDisplayPictureUrl(chatDetails.group_avatar_url)}
            alt={`${chatDetails.group_name || 'Group'} icon`}
            className={styles.groupIcon}
          />
          <h4>{chatDetails.group_name}</h4>
          <p>{chatDetails.members.length} Members</p>
        </div>

        {canManageMembers && (
          <button className={styles.addMemberButton} onClick={() => setAddModalOpen(true)}>
            <HiUserPlus size={20} />
            Add Member
          </button>
        )}

        <ul className={styles.memberList}>
          {chatDetails.members.map(member => (
            <li key={member.id} className={styles.memberItem}>
              <div className={styles.memberInfo}>
                <img
                  src={getDisplayPictureUrl(member.display_picture_url)}
                  alt={`${member.display_name}'s avatar`}
                />
                <span>{member.display_name}</span>
                {member.id === chatDetails.creator_id && <span className={styles.creatorBadge}>Admin</span>}
              </div>
              {canManageMembers && member.id !== currentUser?.id && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isRemovingMember}
                  className={styles.removeButton}
                  aria-label={`Remove ${member.display_name}`}
                >
                  <HiUserMinus size={20} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
};

export default ChatInfoPanel;