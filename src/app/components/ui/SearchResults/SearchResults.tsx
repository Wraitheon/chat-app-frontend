'use client';

import Image from 'next/image';
import styles from './SearchResults.module.scss';
import { useSearchUsers } from './hooks/useSearchUsers';
import { User } from '@/types/user.types';
import { useDebounce } from '@/app/hooks/useDebounce';

interface SearchResultsProps {
  searchTerm: string;
  onUserSelect: (user: User) => void;
  onResultClick: () => void;
}

const SearchResults = ({ searchTerm, onUserSelect, onResultClick }: SearchResultsProps) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const { data: users, isLoading } = useSearchUsers(debouncedSearchTerm);

  const handleUserClick = (user: User) => {
    onUserSelect(user);
    onResultClick();
  };

  if (!debouncedSearchTerm) {
    return null;
  }

  return (
    <div className={styles.resultsContainer}>
      {isLoading && <div className={styles.info}>Searching...</div>}
      {!isLoading && users?.length === 0 && <div className={styles.info}>No users found.</div>}

      {users && users.length > 0 && (
        <>
          <div className={styles.categoryHeader}>Users</div>
          {users.map((user) => (
            <div
              key={user.id}
              className={styles.userItem}
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
        </>
      )}
    </div>
  );
};

export default SearchResults;