'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';
import { HiXMark } from 'react-icons/hi2';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} ref={modalRef} role="dialog" aria-modal="true">
        <header className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            <HiXMark size={24} />
          </button>
        </header>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;