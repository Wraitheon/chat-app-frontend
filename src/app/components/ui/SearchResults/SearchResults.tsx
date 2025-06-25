'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './SearchResults.module.scss';
import { useSearchUsers } from './hooks/useSearchUsers';
import { useCreateChat } from './hooks/useCreateChat';
import { User } from '@/types/user.types';
import { useDebounce } from '@/app/hooks/useDebounce';

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
    onResultClick();
    const payload = { members: [user.id] };

    createNewChat(payload, {
      onSuccess: (newChat) => {
        router.push(`/chat/${newChat.id}`);
      },
    });
  };

  return (
    <div className={styles.resultsContainer}>
      {isLoading && <div className={styles.info}>Searching...</div>}
      {isCreating && <div className={styles.info}>Creating chat...</div>}

      {users && users.length > 0 && (
        <div className={styles.categoryHeader}>Users</div>
      )}

      {users?.map((user) => (
        <div key={user.id} className={styles.userItem} onClick={() => handleUserClick(user)}>
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

      {users?.length === 0 && !isLoading && <div className={styles.info}>No users found.</div>}
    </div>
  );
};

export default SearchResults;