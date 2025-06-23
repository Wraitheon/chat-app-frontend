'use client';

import { useState, useEffect } from 'react';
import PrimarySidebar from '../PrimarySidebar/PrimarySidebar';
import SecondarySidebar from '../SecondarySidebar/SecondarySidebar';
import ChatPanel from '../ChatPanel/ChatPanel';
import SearchResults from '../../ui/SearchResults/SearchResults';
import styles from './ChatLayout.module.scss';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import CreateGroupChatModal from '../../ui/CreateGroupChatModal/CreateGroupChatModal';

interface ChatLayoutProps {
  initialActiveChatId?: string | null;
}

const ChatLayout = ({ initialActiveChatId = null }: ChatLayoutProps) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(initialActiveChatId);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (activeChatId) {
      setSearchTerm('');
    }
  }, [activeChatId]);

  const handleResultClick = () => {
    setSearchTerm('');
  };

  return (
    <>
      <CreateGroupChatModal
        isOpen={isGroupModalOpen}
        onClose={() => setGroupModalOpen(false)}
      />
      <div className={styles.chatLayoutWrapper}>
        <div className={styles.chatLayout}>
          <header className={styles.globalHeader}>
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchBar}>
                <HiMagnifyingGlass size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search users to start a chat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {debouncedSearchTerm && (
                <SearchResults
                  searchTerm={debouncedSearchTerm}
                  onResultClick={handleResultClick}
                />
              )}
            </div>
          </header>

          <div className={styles.mainContent}>
            <PrimarySidebar onCreateGroupClick={() => setGroupModalOpen(true)} />
            <SecondarySidebar activeChatId={activeChatId} />

            <ChatPanel activeChatId={activeChatId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;