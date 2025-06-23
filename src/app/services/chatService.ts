import { Chat, ChatDetailApiResponse, ChatDetailData, ChatDetails, ChatsData, NewChatData } from "@/types/chat.types";
import { MessagesData } from '@/types/message.types';
import { apiClient } from "../lib/apiClient";

/**
 * Fetches the chats for the currently logged-in user.
 * @returns A promise that resolves to an array of Chat objects.
 */
export const fetchUserChats = async (): Promise<Chat[]> => {
  const data = await apiClient<{ chats: Chat[] }>('/chats/');
  return data.chats; // Now accessing .chats
};

export const fetchChatDetails = async (chatId: string): Promise<ChatDetails> => {
  const response = await apiClient<{ chat: ChatDetails }>(`/chats/${chatId}`);
  return response.chat; // Accessing .chat
};

export const addMemberToChat = async ({ chatId, userId }: { chatId: string, userId: string }): Promise<void> => {
  await apiClient<void>(`/chats/${chatId}/members`, {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId }),
  });
};

export const removeMemberFromChat = async ({ chatId, userId }: { chatId: string, userId: string }): Promise<void> => {
  await apiClient<void>(`/chats/${chatId}/members/${userId}`, {
    method: 'DELETE',
  });
};

export const fetchChatMessages = async (chatId: string) => {
  if (!chatId) {
    // Prevent API call if no chatId is provided
    return [];
  }
  const data = await apiClient<MessagesData>(`/chats/${chatId}/messages`);
  return data.messages;
};

export const markChatAsRead = async (chatId: string): Promise<void> => {
  // This is a POST request with no body, and we don't expect a content response.
  await apiClient<void>(`/chats/${chatId}/read`, {
    method: 'POST',
  });
};

export const createChat = async (payload: {
  members: string[];
  group_name?: string;
  group_avatar_url?: string;
}) => {
  const data = await apiClient<NewChatData>('/chats', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.chat;
};

export const updateChatDetails = async ({ chatId, payload }: { chatId: string, payload: { group_name?: string, group_avatar_url?: string } }): Promise<ChatDetails> => {
  const data = await apiClient<ChatDetailData>(`/api/chats/${chatId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.chat;
};