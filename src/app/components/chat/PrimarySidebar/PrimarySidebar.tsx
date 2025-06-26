'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './PrimarySidebar.module.scss';
import {
  HiHome, HiBell, HiChatBubbleOvalLeftEllipsis, HiEllipsisHorizontal, HiPlus,
  HiCog6Tooth, HiArrowLeftOnRectangle
} from 'react-icons/hi2';
import { useLogout } from './hooks/useLogout';
import { useAuth } from '../../providers/AuthProvider';

interface PrimarySidebarProps {
  onCreateGroupClick: () => void;
  setCurrentPanel: (panel: "user" | "chat" | null) => void;
}

const PrimarySidebar = ({ onCreateGroupClick, setCurrentPanel }: PrimarySidebarProps) => {
  const [activeIcon, setActiveIcon] = useState('Home');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mutate: performLogout, isPending: isLoggingOut } = useLogout();
  const { user: currentUser } = useAuth();

  const navItems = [
    { name: 'Home', icon: <HiHome size={24} /> },
    { name: 'Notifications', icon: <HiBell size={24} /> },
    { name: 'Chat', icon: <HiChatBubbleOvalLeftEllipsis size={24} /> },
    { name: 'More', icon: <HiEllipsisHorizontal size={24} /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <aside className={styles.primarySidebar}>
      <div className={styles.topSection}>
        <div className={styles.workspaceLogo}>
          <Image src="/assets/pulseicon.svg" alt="Workspace" width={40} height={40} />
        </div>
        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.navButton} ${activeIcon === item.name ? styles.active : ''}`}
              onClick={() => setActiveIcon(item.name)}
              aria-label={item.name}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <button
          className={styles.navButton}
          aria-label="Create Group"
          onClick={onCreateGroupClick}
        >
          <HiPlus size={24} />
        </button>

        <button
          className={styles.userAvatarButton}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="User menu"
          disabled={!currentUser}
        >
          <Image
            src='/assets/default-avatar.png'
            alt="User Avatar"
            width={40}
            height={40}
          />
        </button>

        {isMenuOpen && (
          <div ref={menuRef} className={styles.userMenu}>
            <button className={styles.menuButton} onClick={() => { setCurrentPanel("user"); setMenuOpen(false); }}>
              <HiCog6Tooth size={20} />
              <span>Profile Settings</span>
            </button>
            <button
              className={styles.menuButton}
              onClick={() => performLogout()}
              disabled={isLoggingOut}
            >
              <HiArrowLeftOnRectangle size={20} />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default PrimarySidebar;