import { jwtDecode } from "jwt-decode";
import { getStoredAccessToken } from "../api/client";

export function isLoggedIn(): boolean {
  const token = getStoredAccessToken();
  if (!token) return false;

  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    if (!payload?.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowSeconds;
  } catch {
    return false;
  }
}

export function getAccessTokenExpSeconds(): number | null {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}
