'use client';

import Image from 'next/image';
import styles from './PrimarySidebar.module.scss';
import { useState } from 'react';
import {
  HiHome,
  HiBell,
  HiChatBubbleOvalLeftEllipsis,
  HiEllipsisHorizontal,
  HiPlus,
} from 'react-icons/hi2';

interface PrimarySidebarProps {
  onCreateGroupClick: () => void;
}

const PrimarySidebar = ({ onCreateGroupClick }: PrimarySidebarProps) => {
  const [activeIcon, setActiveIcon] = useState('Home');

  const navItems = [
    { name: 'Home', icon: <HiHome size={24} /> },
    { name: 'Notifications', icon: <HiBell size={24} /> },
    { name: 'Chat', icon: <HiChatBubbleOvalLeftEllipsis size={24} /> },
    { name: 'More', icon: <HiEllipsisHorizontal size={24} /> },
  ];

  return (
    <aside className={styles.primarySidebar}>
      <div className={styles.topSection}>
        <div className={styles.workspaceLogo}>
          <Image src="/assets/default-workspace.png" alt="Workspace" width={40} height={40} />
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

        <div className={styles.userAvatar}>
          <Image src="/assets/default-avatar.png" alt="User Avatar" width={40} height={40} />
        </div>
      </div>
    </aside>
  );
};

export default PrimarySidebar;