'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './CreateGroupChatModal.module.scss';
import { useSearchUsers } from '../SearchResults/hooks/useSearchUsers'; // We can reuse this hook
import { useCreateChat } from '../SearchResults/hooks/useCreateChat'; // And this one too
import { useAuth } from '@/app/components/providers/AuthProvider'; // To get the current user
import { User } from '@/types/user.types';
import { HiX } from 'react-icons/hi';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupChatModal = ({ isOpen, onClose }: CreateGroupChatModalProps) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchTerm);
  const { mutate: createGroupChat, isPending: isCreating } = useCreateChat();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectUser = (user: User) => {
    if (user.id === currentUser?.id || selectedUsers.some(su => su.id === user.id)) {
      return;
    }
    setSelectedUsers(prev => [...prev, user]);
    setSearchTerm('');
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) return;

    const memberIds = [currentUser.id, ...selectedUsers.map(u => u.id)];

    const payload = {
      members: memberIds,
      group_name: groupName,
      ...(groupAvatar.trim() && { group_avatar_url: groupAvatar.trim() })
    };

    createGroupChat(payload, {
      onSuccess: (newChat) => {
        onClose();
        resetState();
        router.push(`/chat/${newChat.id}`);
      }
    });
  };

  const resetState = () => {
    setGroupName('');
    setGroupAvatar('');
    setSelectedUsers([]);
    setSearchTerm('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Create a New Group</h2>

        <div className={styles.formGroup}>
          <label htmlFor="groupName">Group Name (Required)</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Project Phoenix Team"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="groupAvatar">Group Avatar URL (Optional)</label>
          <input
            id="groupAvatar"
            type="text"
            value={groupAvatar}
            onChange={(e) => setGroupAvatar(e.target.value)}
            placeholder="https://example.com/image.png"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userSearch">Add Members</label>
          <div className={styles.selectedUsersContainer}>
            {selectedUsers.map(user => (
              <div key={user.id} className={styles.userPill}>
                <span>{user.display_name}</span>
                <button onClick={() => handleRemoveUser(user.id)}><HiX size={14} /></button>
              </div>
            ))}
          </div>

          <input
            id="userSearch"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for users to add..."
          />
        </div>

        {debouncedSearchTerm && (
          <div className={styles.searchResults}>
            {isSearching && <div className={styles.info}>Searching...</div>}
            {searchResults?.map(user => (
              <div key={user.id} className={styles.userItem} onClick={() => handleSelectUser(user)}>
                <Image src={user.display_picture_url || '/assets/default-avatar.png'} alt="avatar" width={24} height={24} />
                <span>{user.display_name} (@{user.username})</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={handleClose}>Cancel</button>
          <button
            className={styles.createButton}
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;