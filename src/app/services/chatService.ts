import { Chat, ChatDetails, NewChatData } from "@/types/chat.types";
import { apiClient } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";

export const fetchUserChats = async (): Promise<Chat[]> => {
  const endpoint = API_ROUTES.chats.getChats;
  return await apiClient<Chat[]>(endpoint);
};

export const fetchChatDetails = async (chatId: string): Promise<ChatDetails> => {
  const endpoint = API_ROUTES.chats.getChatDetails(chatId);
  return await apiClient<ChatDetails>(endpoint);
};

export const addMemberToChat = async ({ chatId, userId }: { chatId: string, userId: string }): Promise<void> => {
  const endpoint = API_ROUTES.chats.addMemberToChat;

  const payload = {
    user_id: userId
  };

  await apiClient<void>(endpoint(chatId), {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
};

export const removeMemberFromChat = async ({ chatId, userId }: { chatId: string, userId: string }): Promise<void> => {
  const endpoint = API_ROUTES.chats.removeMemberFromChat;
  await apiClient<void>(endpoint(chatId, userId), {
    method: 'DELETE',
  });
};

export const markChatAsRead = async (chatId: string): Promise<void> => {
  const endpoint = API_ROUTES.chats.markChatAsRead;
  await apiClient<void>(endpoint(chatId), {
    method: 'POST',
  });
};

export const createChat = async (payload: {
  members: string[];
  group_name?: string;
  group_avatar_url?: string;
}) => {
  const endpoint = API_ROUTES.chats.createChat;
  return await apiClient<NewChatData>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateChatDetails = async ({ chatId, payload }: {
  chatId: string,
  payload: {
    group_name?: string,
    group_avatar_url?: string
  }
}): Promise<NewChatData> => {
  const endpoint = API_ROUTES.chats.updateChatDetails;
  return await apiClient<NewChatData>(endpoint(chatId), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};