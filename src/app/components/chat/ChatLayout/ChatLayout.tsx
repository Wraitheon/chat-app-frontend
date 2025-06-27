'use client';

import PrimarySidebar from '../PrimarySidebar/PrimarySidebar';
import SecondarySidebar from '../SecondarySidebar/SecondarySidebar';
import ChatPanel from '../ChatPanel/ChatPanel';
import SearchResults from '../../ui/SearchResults/SearchResults';
import styles from './ChatLayout.module.scss';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import CreateGroupChatModal from '../CreateGroupChatModal/CreateGroupChatModal';
import UserInfoPanel from '../UserInfoPanel/UserInfoPanel';
import ChatInfoPanel from '../ChatInfoPanel/ChatInfoPanel';
import { useChatLayout } from './hooks/useChatLayout';

interface ChatLayoutProps {
  initialActiveChatId?: string | null;
}

const ChatLayout = ({ initialActiveChatId = null }: ChatLayoutProps) => {
  const {
    activeChatId,
    searchTerm,
    isGroupModalOpen,
    currentPanel,
    currentUser,
    chatDetails,
    setSearchTerm,
    setCurrentPanel,
    openGroupModal,
    closeGroupModal,
    closePanel,
    handleUserUpdate,
    handleChatUpdate,
    handleResultClick,
    handleUserSelect,
  } = useChatLayout(initialActiveChatId);

  return (
    <>
      <CreateGroupChatModal
        isOpen={isGroupModalOpen}
        onClose={closeGroupModal}
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

              {searchTerm && (
                <SearchResults
                  searchTerm={searchTerm}
                  onResultClick={handleResultClick}
                  onUserSelect={handleUserSelect}
                />
              )}
            </div>
          </header>

          <div className={styles.mainContent}>
            <PrimarySidebar
              onCreateGroupClick={openGroupModal}
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
          onClose={closePanel}
          userDetails={currentUser}
          onUserUpdate={handleUserUpdate}
        />
      )}

      {chatDetails && (
        <ChatInfoPanel
          isOpen={currentPanel === 'chat'}
          onClose={closePanel}
          chatDetails={chatDetails}
          onChatUpdate={handleChatUpdate}
        />
      )}
    </>
  );
};

export default ChatLayout;