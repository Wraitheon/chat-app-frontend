'use client';

import { useState } from 'react';
import styles from './AddMemberModal.module.scss';
import Image from 'next/image';
import { HiXMark, HiMagnifyingGlass, HiUserPlus } from 'react-icons/hi2';
import { useSearchUsers } from '../SearchResults/hooks/useSearchUsers';
import { useManageChatMembers } from '../../chat/ChatInfoPanel/hooks/useManageChatMembers';
import { useDebounce } from '@/app/hooks/useDebounce';
import { User } from '@/types/user.types';
import { ChatMember } from '@/types/chat.types';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentMembers: ChatMember[];
}

const AddMemberModal = ({ isOpen, onClose, chatId, currentMembers }: AddMemberModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchTerm);
  const { addMember, isAddingMember } = useManageChatMembers(chatId);

  const handleAddMember = (user: User) => {
    addMember(user.id, {
      onSuccess: () => {
        onClose();
        setSearchTerm('');
      }
    });
  };

  const resetAndClose = () => {
    setSearchTerm('');
    onClose();
  };

  const availableUsers = searchResults?.filter(
    (user) => !currentMembers.some((member) => member.id === user.id)
  );

  const showLoading = isSearching;
  const showResults = debouncedSearchTerm && !isSearching && availableUsers && availableUsers.length > 0;
  const showNoResultsMessage = debouncedSearchTerm && !isSearching && availableUsers?.length === 0;

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={resetAndClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2>Add Member to Group</h2>
          <button onClick={resetAndClose} className={styles.closeButton}>
            <HiXMark size={24} />
          </button>
        </header>

        <div className={styles.searchContainer}>
          <HiMagnifyingGlass className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for users to add..."
            autoFocus
          />
        </div>

        <div className={styles.searchResults}>
          {showLoading && <div className={styles.info}>Searching...</div>}

          {showResults &&
            availableUsers.map(user => (
              <div key={user.id} className={styles.userItem}>
                <Image src={user.display_picture_url || '/assets/default-avatar.png'} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
                <div className={styles.userInfo}>
                  <span className={styles.primaryText}>{user.display_name}</span>
                  <span className={styles.secondaryText}>@{user.username}</span>
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => handleAddMember(user)}
                  disabled={isAddingMember}
                  aria-label={`Add ${user.display_name}`}
                >
                  <HiUserPlus size={22} />
                </button>
              </div>
            ))
          }

          {showNoResultsMessage && (
            <div className={styles.info}>No new users found.</div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={resetAndClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;