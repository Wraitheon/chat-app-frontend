export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  display_picture_url?: string | null;
  status_message?: string | null;
  created_at?: string;
}