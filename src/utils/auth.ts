import { getStoredAccessToken } from "../api/client";

export function isLoggedIn(): boolean {
  return Boolean(getStoredAccessToken());
}
