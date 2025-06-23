import { User } from './user.types';

export interface Chat {
  id: string;
  type: 'group' | 'direct';
  group_name: string | null;
  group_avatar_url: string | null;
  last_message_content: string | null;
  last_message_sender: string | null;
  last_message_at: string | null;
  other_member_id: string | null;
  other_member_username: string | null;
  other_member_display_name: string | null;
  other_member_avatar: string | null;
  unread_count: string;
}

export interface ChatMember {
  id: string;
  display_name: string;
}

export interface ChatDetails {
  id: string;
  type: 'group' | 'direct';
  group_name: string | null;
  group_avatar_url: string | null;
  creator_id: string | null;
  created_at: string;
  updated_at: string;
  members: ChatMember[];
}

export interface ChatsData {
  chats: Chat[];
}

export interface NewChatData {
  chat: Chat;
}

export interface ChatDetailData {
  chat: ChatDetails;
}

export interface ChatDetailApiResponse {
  chat: ChatDetails | PromiseLike<ChatDetails>;
  success: boolean;
  data: {
    chat: ChatDetails;
  };
}