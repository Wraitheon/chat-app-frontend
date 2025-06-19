'use client';

import Image from 'next/image';
import styles from './AuthModal.module.scss';
import { Righteous, Roboto } from 'next/font/google';

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

type AuthModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  secondaryActionText: string;
  secondaryActionLinkText: string;
  onSecondaryAction: () => void;
};

const AuthModal = ({
  title,
  onClose,
  children,
  secondaryActionText,
  secondaryActionLinkText,
  onSecondaryAction,
}: AuthModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <Image src="/assets/close-icon.svg" alt="Close modal" width={16} height={16} />
        </button>
        <h2 className={`${styles.title} ${righteous.className}`}>{title}</h2>

        {children}

        <div className={`${styles.divider} ${roboto.className}`}>
          <span>or</span>
        </div>

        <button className={`${styles.secondaryAction} ${roboto.className}`} onClick={onSecondaryAction}>
          {secondaryActionText}{' '}
          <span>{secondaryActionLinkText}</span>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;