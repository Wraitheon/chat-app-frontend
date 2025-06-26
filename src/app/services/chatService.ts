import { Chat, ChatDetails, CreateChatPayload, NewChatData } from "@/types/chat.types";
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

export const createChatOrGroup = async (payload: CreateChatPayload): Promise<NewChatData> => {
  const endpoint = API_ROUTES.chats.createChat;

  let body: FormData | string;
  const headers: HeadersInit = {};

  if (payload.group_avatar) {
    const formData = new FormData();

    if (payload.group_name) {
      formData.append('group_name', payload.group_name);
    }

    payload.members.forEach((memberId: string) => {
      formData.append('members[]', memberId);
    });

    formData.append('group_avatar', payload.group_avatar);

    body = formData;
  } else {
    body = JSON.stringify({
      members: payload.members,
      group_name: payload.group_name,
    });
    headers['Content-Type'] = 'application/json';
  }

  return await apiClient<NewChatData>(endpoint, {
    method: 'POST',
    headers,
    body,
  });
};


export const updateChatDetails = async ({ chatId, formData, group_name }: {
  chatId: string;
  formData: FormData;
  group_name?: string;
}): Promise<NewChatData> => {
  const endpoint = API_ROUTES.chats.updateChatDetails;

  if (group_name) {
    formData.append('group_name', group_name);
  }

  return await apiClient<NewChatData>(endpoint(chatId), {
    method: 'PATCH',
    body: formData,
  });
};