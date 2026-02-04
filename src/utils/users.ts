import { jwtDecode } from "jwt-decode";
import { getStoredAccessToken } from "../api/client";

type UserPayload = {
  username: string;
  name: string;
};

export const getUser = (): UserPayload | null => {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<UserPayload>(token);
  } catch {
    return null;
  }
};
