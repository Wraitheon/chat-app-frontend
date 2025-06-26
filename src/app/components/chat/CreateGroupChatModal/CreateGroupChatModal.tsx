'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Modal from '../../ui/Modal/Modal';
import styles from './CreateGroupChatModal.module.scss';
import { useSearchUsers } from '../../ui/SearchResults/hooks/useSearchUsers';
import { useCreateChat } from '@/app/hooks/useCreateChat';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { User } from '@/types/user.types';
import { HiXCircle, HiPhoto, HiArrowPath } from 'react-icons/hi2';
import { CreateChatPayload } from '@/types/chat.types';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupChatModal = ({ isOpen, onClose }: CreateGroupChatModalProps) => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchTerm);
  const { mutate: createChat, isPending: isCreating } = useCreateChat();
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!groupAvatarFile) {
      setPreviewUrl(null);
      return;
    };
    const objectUrl = URL.createObjectURL(groupAvatarFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [groupAvatarFile]);

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

  const resetState = () => {
    setGroupName('');
    setGroupAvatarFile(null);
    setPreviewUrl(null);
    setSelectedUsers([]);
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0 || !currentUser) return;

    const payload: CreateChatPayload = {
      group_name: groupName.trim(),
      members: selectedUsers.map(u => u.id),
      group_avatar: groupAvatarFile,
    };

    createChat(payload, {
      onSuccess: (newChat) => {
        handleClose();
        router.push(`/chat/${newChat.id}`);
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a New Group">
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.iconUploader}>
          <img src={previewUrl || '/assets/splashscreen.svg'} alt="Group icon preview" className={styles.iconPreview} />
          <label htmlFor="groupAvatarInput" className={styles.uploadButton}>
            <HiPhoto size={20} />
            <span>{groupAvatarFile ? 'Change Icon' : 'Add Icon (Optional)'}</span>
          </label>
          <input
            id="groupAvatarInput"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setGroupAvatarFile(e.target.files ? e.target.files[0] : null)}
            className={styles.fileInput}
            disabled={isCreating}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="groupName">Group Name (Required)</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Project Phoenix Team"
            required
            disabled={isCreating}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userSearch">Add Members</label>
          <div className={styles.selectedUsersContainer}>
            {selectedUsers.map(user => (
              <div key={user.id} className={styles.userPill}>
                <span>{user.display_name}</span>
                <button type="button" onClick={() => handleRemoveUser(user.id)}><HiXCircle size={14} /></button>
              </div>
            ))}
          </div>
          <input
            id="userSearch"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for users to add..."
            disabled={isCreating}
            className={styles.inputField}
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
            {!isSearching && searchResults?.length === 0 && <div className={styles.info}>No users found.</div>}
          </div>
        )}

        <div className={styles.modalActions}>
          <button type="button" className={styles.buttonSecondary} onClick={handleClose} disabled={isCreating}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.buttonPrimary}
            disabled={!groupName.trim() || selectedUsers.length === 0 || isCreating}
          >
            {isCreating ? <HiArrowPath className={styles.spinner} /> : 'Create Group'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupChatModal;