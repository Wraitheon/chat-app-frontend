import { Message } from "@/types/message.types";
import { API_ROUTES } from "../lib/apiRoutes";
import { apiClient } from "../lib/apiClient";

export const fetchChatMessages = async (chatId: string): Promise<Message[]> => {
  if (!chatId) return [];

  const endpoint = API_ROUTES.messages.getMessages(chatId);

  const messages = await apiClient<Message[]>(endpoint);

  return messages || [];
};