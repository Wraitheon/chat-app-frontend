'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ChatDetails } from '@/types/chat.types';
import Modal from '../Modal/Modal';
import { useUpdateChatInfo } from '../../chat/ChatInfoPanel/hooks/useUpdateChatInfo';
import styles from './EditGroupInfoModal.module.scss';
import { HiPhoto, HiArrowPath } from 'react-icons/hi2';
import { getDisplayPictureUrl } from '@/app/lib/assetUtils';

interface EditGroupInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatDetails: ChatDetails;
  onUpdateSuccess: () => void;
}

const EditGroupInfoModal = ({ isOpen, onClose, chatDetails, onUpdateSuccess }: EditGroupInfoModalProps) => {
  const [groupName, setGroupName] = useState(chatDetails.group_name || '');
  const [groupIconFile, setGroupIconFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(getDisplayPictureUrl(chatDetails.group_avatar_url));

  const { mutate: updateChat, isPending: isUpdating } = useUpdateChatInfo();

  useEffect(() => {
    if (isOpen) {
      setGroupName(chatDetails.group_name || '');
      setPreviewUrl(getDisplayPictureUrl(chatDetails.group_avatar_url));
      setGroupIconFile(null);
    }
  }, [isOpen, chatDetails]);

  useEffect(() => {
    if (!groupIconFile) return;
    const objectUrl = URL.createObjectURL(groupIconFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [groupIconFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (groupName !== chatDetails.group_name) {
      formData.append('group_name', groupName);
    }
    if (groupIconFile) {
      formData.append('group_avatar', groupIconFile);
    }

    if (formData.entries().next().done) {
      onClose();
      return;
    }

    updateChat({ chatId: chatDetails.id, formData }, {
      onSuccess: () => {
        onUpdateSuccess();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Group Info">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.iconUploader}>
          <img src={previewUrl || '/default-group-avatar.png'} alt="Group icon preview" className={styles.iconPreview} />
          <label htmlFor="groupIconInput" className={styles.uploadButton}>
            <HiPhoto size={20} />
            <span>Change Icon</span>
          </label>
          <input
            id="groupIconInput"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setGroupIconFile(e.target.files ? e.target.files[0] : null)}
            className={styles.fileInput}
            disabled={isUpdating}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="groupName" className={styles.label}>
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className={styles.inputField}
            required
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

export default EditGroupInfoModal;