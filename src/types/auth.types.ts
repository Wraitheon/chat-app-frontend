import { User } from "./user.types";

export type LoginCredentials = {
  identifier: string;
  password: string;
};

export interface LoginResponseData {
  user: User;
  token: string; // The JWT token
}