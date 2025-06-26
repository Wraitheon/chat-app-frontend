'use client';

import { useState, useEffect, FormEvent } from 'react';
import Modal from '../Modal/Modal';
import styles from './EditUserInfoModal.module.scss';
import { User } from '@/types/user.types';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';
import { HiPhoto, HiArrowPath } from 'react-icons/hi2';
import { useUpdateUserInfo } from './hooks/useUpdateUserInfo';

interface EditUserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserDetails: User;
  onUpdateSuccess: () => void;
}

const EditUserInfoModal = ({ isOpen, onClose, currentUserDetails, onUpdateSuccess }: EditUserInfoModalProps) => {
  const [displayName, setDisplayName] = useState(currentUserDetails.display_name);
  const [statusMessage, setStatusMessage] = useState(currentUserDetails.status_message || '');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getDisplayPictureUrl(currentUserDetails.display_picture_url));

  const { mutate: updateUserInfo, isPending: isUpdating } = useUpdateUserInfo();

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentUserDetails.display_name);
      setStatusMessage(currentUserDetails.status_message || '');
      setProfilePictureFile(null);
      setPreviewUrl(getDisplayPictureUrl(currentUserDetails.display_picture_url));
    }
  }, [isOpen, currentUserDetails]);

  useEffect(() => {
    if (!profilePictureFile) return;
    const objectUrl = URL.createObjectURL(profilePictureFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePictureFile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (displayName !== currentUserDetails.display_name) {
      formData.append('display_name', displayName);
    }
    if (statusMessage !== (currentUserDetails.status_message || '')) {
      formData.append('status_message', statusMessage);
    }
    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }

    if (!formData.entries().next().done) {
      updateUserInfo({ formData }, {
        onSuccess: () => {
          onUpdateSuccess();
        }
      });
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Your Profile">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.iconUploader}>
          <img src={previewUrl || '/default-avatar.png'} alt="Profile picture preview" className={styles.iconPreview} />
          <label htmlFor="profilePictureInput" className={styles.uploadButton}>
            <HiPhoto size={20} />
            <span>Change Picture</span>
          </label>
          <input
            id="profilePictureInput"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePictureFile(e.target.files ? e.target.files[0] : null)}
            className={styles.fileInput}
            disabled={isUpdating}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={styles.inputField}
            required
            disabled={isUpdating}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="statusMessage">Status Message</label>
          <textarea
            id="statusMessage"
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            className={styles.textareaField}
            rows={3}
            placeholder="What's on your mind?"
            disabled={isUpdating}
          />
        </div>

        <div className={styles.modalActions}>
          <button type="button" onClick={onClose} className={styles.buttonSecondary} disabled={isUpdating}>
            Cancel
          </button>
          <button type="submit" className={styles.buttonPrimary} disabled={isUpdating}>
            {isUpdating ? <HiArrowPath className={styles.spinner} /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserInfoModal;