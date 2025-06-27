import { User } from "./user.types";

export type LoginCredentials = {
  identifier: string;
  password: string;
};

export type LoginErrors = {
  identifier: string;
  password: string;
};

export interface LoginResponseData {
  user: User;
  token: string; // The JWT token
}

export type RegistrationData = {
  username: string;
  email: string;
  password: string;
  displayName: string;
};

export type RegisterResponse = {
  status: string;
  data: {
    user: User;
    token: string;
  };
  message?: string;
};
