'use client';

import Image from 'next/image';
import Modal from '../../ui/Modal/Modal';
import styles from './CreateGroupChatModal.module.scss';
import { HiXCircle, HiPhoto, HiArrowPath } from 'react-icons/hi2';
import { useCreateGroupChatForm } from './hooks/useCreateGroupChatForm';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupChatModal = ({ isOpen, onClose }: CreateGroupChatModalProps) => {
  const {
    groupName,
    groupAvatarFile,
    previewUrl,
    selectedUsers,
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    isSearching,
    isCreating,
    setGroupName,
    setGroupAvatarFile,
    setSearchTerm,
    handleSelectUser,
    handleRemoveUser,
    handleSubmit,
    handleClose,
  } = useCreateGroupChatForm(onClose);

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