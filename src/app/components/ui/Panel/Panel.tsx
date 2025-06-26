// src/components/ui/Panel/Panel.tsx

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
  // This state controls whether the component is in the DOM.
  // We initialize it to `isOpen` to handle cases where the panel starts open.
  const [isMounted, setIsMounted] = useState(isOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = wrapperRef.current;
    let timerId: NodeJS.Timeout;

    // --- Part 1: Handle Mounting and Enter Animation ---
    if (isOpen && !isMounted) {
      setIsMounted(true);
      // Note: The rest of the "enter" logic runs in the re-render after this state change.
      return;
    }

    // If not mounted, or the ref is not ready, we can't do anything.
    if (!isMounted || !node) {
      return;
    }

    // --- Part 2: Handle Animations (Enter/Exit) and Unmounting ---

    // This handler unmounts the component after the exit animation finishes.
    const handleTransitionEnd = (event: TransitionEvent) => {
      // Ensure we're only responding to the transition of the panel itself.
      if (event.target === node.querySelector(`.${styles.panel}`)) {
        // If the panel is closing, remove it from the DOM.
        if (!isOpen) {
          setIsMounted(false);
        }
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);

    if (isOpen) {
      // To trigger the enter animation, we need to add the class *after* the
      // component has been painted in its initial (off-screen) state.
      // A small timeout is a reliable way to achieve this.
      timerId = setTimeout(() => {
        node.classList.add(styles.isOpen);
      }, 10);
    } else {
      // To trigger the exit animation, we simply remove the class.
      // The `transitionend` listener above will handle the unmounting.
      node.classList.remove(styles.isOpen);
    }

    // --- Part 3: Cleanup ---
    // This runs when the effect re-runs or the component unmounts.
    return () => {
      clearTimeout(timerId);
      node.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [isOpen, isMounted]); // The effect now correctly manages its entire lifecycle.


  // If not mounted, return null to remove from the DOM.
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