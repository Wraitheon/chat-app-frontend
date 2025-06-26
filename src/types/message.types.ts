export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text_content: string;
  image_data_url: string | null;
  created_at: string;
  sender_username: string;
  sender_display_name: string;
  sender_display_picture_path?: string | null;
  sender_display_picture_url?: string | null;
}