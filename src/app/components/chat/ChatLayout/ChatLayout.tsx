'use client';

import { useState, useEffect } from 'react';
import PrimarySidebar from '../PrimarySidebar/PrimarySidebar';
import SecondarySidebar from '../SecondarySidebar/SecondarySidebar';
import ChatPanel from '../ChatPanel/ChatPanel';
import SearchResults from '../../ui/SearchResults/SearchResults';
import styles from './ChatLayout.module.scss';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import CreateGroupChatModal from '../CreateGroupChatModal/CreateGroupChatModal';
import UserInfoPanel from '../UserInfoPanel/UserInfoPanel';
import ChatInfoPanel from '../ChatInfoPanel/ChatInfoPanel';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import { useChatDetails } from '../ChatHeader/hooks/useChatDetails';

interface ChatLayoutProps {
  initialActiveChatId?: string | null;
}

const ChatLayout = ({ initialActiveChatId = null }: ChatLayoutProps) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(initialActiveChatId);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<"user" | "chat" | null>(null);

  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  const { data: chatDetails } = useChatDetails(activeChatId);

  const handleUserUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  const handleChatUpdate = () => {
    if (activeChatId) {
      queryClient.invalidateQueries({ queryKey: ['chatDetails', activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  };

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
            <PrimarySidebar
              onCreateGroupClick={() => setGroupModalOpen(true)}
              setCurrentPanel={setCurrentPanel}
            />
            <SecondarySidebar activeChatId={activeChatId} />
            <ChatPanel
              activeChatId={activeChatId}
              setCurrentPanel={setCurrentPanel}
            />
          </div>
        </div>
      </div>

      {currentUser && (
        <UserInfoPanel
          isOpen={currentPanel === 'user'}
          onClose={() => setCurrentPanel(null)}
          userDetails={currentUser}
          onUserUpdate={handleUserUpdate}
        />
      )}

      {chatDetails && (
        <ChatInfoPanel
          isOpen={currentPanel === 'chat'}
          onClose={() => setCurrentPanel(null)}
          chatDetails={chatDetails}
          onChatUpdate={handleChatUpdate}
        />
      )}
    </>
  );
};

export default ChatLayout;