'use client';

import styles from './ChatInfoPanel.module.scss';
import { HiXMark, HiUserPlus, HiUserMinus } from 'react-icons/hi2';
import { ChatDetails } from '@/types/chat.types';
import { useManageChatMembers } from './hooks/useManageChatMembers';
import { useState } from 'react';
import AddMemberModal from '../../ui/AddMemberModal/AddMemberModal';
import { useAuth } from '@/app/components/providers/AuthProvider';

interface ChatInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chatDetails: ChatDetails;
}

const ChatInfoPanel = ({ isOpen, onClose, chatDetails }: ChatInfoPanelProps) => {
  const { user: currentUser } = useAuth();
  const { removeMember, isRemovingMember } = useManageChatMembers(chatDetails.id);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const canManageMembers = currentUser?.id === chatDetails.creator_id;

  const handleRemoveMember = (userId: string) => {
    removeMember(userId);
  };

  return (
    <>
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        chatId={chatDetails.id}
        currentMembers={chatDetails.members}
      />
      <aside className={`${styles.infoPanel} ${isOpen ? styles.isOpen : ''}`}>
        <header className={styles.panelHeader}>
          <h3>Group Info</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <HiXMark size={24} />
          </button>
        </header>
        <div className={styles.panelContent}>
          <div className={styles.groupMeta}>
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
                  <img src="/assets/default-avatar.png" alt="avatar" />
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
        </div>
      </aside>
    </>
  );
};

export default ChatInfoPanel;