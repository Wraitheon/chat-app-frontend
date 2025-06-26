export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  users: {
    search: (query: string) => `/users/?search=${query}`,
    getUser: `/users/me`,
    updateUser: `/users/me`,
  },
  chats: {
    getChats: `/chats/`,
    getChatDetails: (chatId: string) => `/chats/${chatId}`,
    addMemberToChat: (chatId: string) => `/chats/${chatId}/members`,
    removeMemberFromChat: (chatId: string, userId: string) => `/chats/${chatId}/members/${userId}`,
    markChatAsRead: (chatId: string) => `/chats/${chatId}/read`,
    createChat: `/chats`,
    updateChatDetails: (chatId: string) => `/chats/${chatId}`,
  },
  messages: {
    getMessages: (chatId: string) => `/chats/${chatId}/messages`,
  }
};