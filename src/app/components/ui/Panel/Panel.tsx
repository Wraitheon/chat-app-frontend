import React, { useState, useEffect, useRef } from 'react';
import { HiXMark } from 'react-icons/hi2';
import styles from './Panel.module.scss';

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({
  isOpen,
  onClose,
  title,
  headerActions,
  children,
  footer,
  className = '',
}) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    let timerId: NodeJS.Timeout;

    if (isOpen && !isMounted) {
      setIsMounted(true);
      return;
    }

    if (!isMounted || !node) {
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === node.querySelector(`.${styles.panel}`)) {
        if (!isOpen) {
          setIsMounted(false);
        }
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);

    if (isOpen) {
      timerId = setTimeout(() => {
        node.classList.add(styles.isOpen);
      }, 10);
    } else {
      node.classList.remove(styles.isOpen);
    }

    return () => {
      clearTimeout(timerId);
      node.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className={styles.panelWrapper}
      aria-hidden={!isOpen}
    >
      <div className={styles.panelBackdrop} onClick={onClose} />
      <aside
        className={`${styles.panel} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        <header className={styles.panelHeader}>
          <div className={styles.headerTitle}>
            {title && <h3 id="panel-title">{title}</h3>}
          </div>
          <div className={styles.headerActions}>
            {headerActions}
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close panel"
            >
              <HiXMark size={24} />
            </button>
          </div>
        </header>

        <div className={styles.panelContent}>{children}</div>

        {footer && <footer className={styles.panelFooter}>{footer}</footer>}
      </aside>
    </div>
  );
};

export default Panel;