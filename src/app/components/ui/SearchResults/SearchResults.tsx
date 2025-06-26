'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './SearchResults.module.scss';
import { useSearchUsers } from './hooks/useSearchUsers';
import { useCreateChat } from '@/app/hooks/useCreateChat';
import { User } from '@/types/user.types';
import { useDebounce } from '@/app/hooks/useDebounce';
import { CreateChatPayload } from '@/types/chat.types';

interface SearchResultsProps {
  searchTerm: string;
  onResultClick: () => void;
}

const SearchResults = ({ searchTerm, onResultClick }: SearchResultsProps) => {
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const { data: users, isLoading } = useSearchUsers(debouncedSearchTerm);
  const { mutate: createNewChat, isPending: isCreating } = useCreateChat();

  const handleUserClick = (user: User) => {
    if (isCreating) return;

    onResultClick();

    const payload: CreateChatPayload = { members: [user.id] };

    createNewChat(payload, {
      onSuccess: (newChat) => {
        router.push(`/chat/${newChat.id}`);
      },
    });
  };

  const getStatusMessage = () => {
    if (isLoading) return 'Searching...';
    if (isCreating) return 'Starting chat...';
    if (users?.length === 0 && !isLoading) return 'No users found.';
    return null;
  }
  const statusMessage = getStatusMessage();


  return (
    <div className={styles.resultsContainer}>
      {statusMessage && <div className={styles.info}>{statusMessage}</div>}

      {users && users.length > 0 && !statusMessage && (
        <div className={styles.categoryHeader}>Users</div>
      )}

      {users?.map((user) => (
        <div
          key={user.id}
          className={`${styles.userItem} ${isCreating ? styles.disabled : ''}`}
          onClick={() => handleUserClick(user)}
        >
          <Image
            src={user.display_picture_url || '/assets/default-avatar.png'}
            alt={user.display_name || 'avatar'}
            width={32}
            height={32}
            className={styles.avatarImage}
          />
          <div className={styles.textWrapper}>
            <span className={styles.primaryText}>{user.display_name}</span>
            <span className={styles.secondaryText}>@{user.username}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;