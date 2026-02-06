import type { TokenResponse } from "../types/auth";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://front-mission.bigs.or.kr";

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ApiOptions = RequestInit & {
  accessToken?: string | null;
  refreshToken?: string | null;
  auth?: boolean;
  retryOnAuthError?: boolean;
};

function isTokenResponse(data: unknown): data is TokenResponse {
  if (typeof data !== "object" || data === null) return false;

  const record = data as Record<string, unknown>;

  return (
    typeof record.accessToken === "string" &&
    typeof record.refreshToken === "string"
  );
}

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

function setCookie(
  name: string,
  value: string,
  maxAgeSeconds = 60 * 60 * 24 * 7,
) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] ?? "");
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setAuthTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken);
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
}

export function clearAuthTokens() {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
}

export function getStoredAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getStoredRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const {
    accessToken: overrideAccessToken,
    refreshToken: overrideRefreshToken,
    auth,
    retryOnAuthError = true,
    headers,
    ...rest
  } = options;

  const accessToken =
    overrideAccessToken ?? (auth ? getStoredAccessToken() : null);
  const refreshToken =
    overrideRefreshToken ?? (auth ? getStoredRefreshToken() : null);

  const doFetch = async (token: string | null): Promise<Response> => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {}),
      },
    });
  };

  let res = await doFetch(accessToken);

  if (
    (res.status === 401 || res.status === 403) &&
    retryOnAuthError &&
    auth &&
    endpoint !== "/auth/refresh"
  ) {
    const refreshResult = await tryRefreshTokens(refreshToken);
    if (refreshResult) {
      // retry with new access token
      res = await doFetch(refreshResult.accessToken);
    }
  }

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const message = isErrorWithMessage(data)
      ? data.message
      : `Request failed (${res.status})`;

    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

async function tryRefreshTokens(
  tokenFromParam?: string | null,
): Promise<TokenResponse | null> {
  const refreshToken = tokenFromParam ?? getStoredRefreshToken();
  if (!refreshToken) return null;

  const isServer = typeof document === "undefined";

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const text = await res.text();
    const data = text ? safeJsonParse(text) : null;

    if (!res.ok) {
      // refreshToken 자체가 만료/무효면 쿠키 정리 (클라이언트에서만)
      if (!isServer) {
        clearAuthTokens();
      }
      return null;
    }

    if (isTokenResponse(data)) {
      // 클라이언트 환경에서만 쿠키에 저장
      if (!isServer) {
        setAuthTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      }
      return data;
    }

    return null;
  } catch {
    return null;
  }
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function isErrorWithMessage(value: unknown): value is { message: string } {
  if (typeof value !== "object" || value === null) return false;
  if (!("message" in value)) return false;
  return typeof (value as Record<string, unknown>).message === "string";
}
