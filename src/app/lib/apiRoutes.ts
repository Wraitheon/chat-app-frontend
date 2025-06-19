const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ROUTES = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
};