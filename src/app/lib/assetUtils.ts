const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5005';
const DEFAULT_AVATAR_URL = '/assets/default-avatar.png';

export function getDisplayPictureUrl(path: string | null | undefined): string {
  if (path) {
    return `${API_BASE_URL}${path}`;
  }

  return DEFAULT_AVATAR_URL;
}