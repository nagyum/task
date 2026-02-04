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
  auth?: boolean;
  retryOnAuthError?: boolean;
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
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
    auth,
    retryOnAuthError = true,
    headers,
    ...rest
  } = options;

  const accessToken =
    overrideAccessToken ?? (auth ? getStoredAccessToken() : null);

  const doFetch = async (): Promise<Response> => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(headers ?? {}),
      },
    });
  };

  let res = await doFetch();
  if (
    res.status === 401 &&
    retryOnAuthError &&
    auth &&
    endpoint !== "/auth/refresh"
  ) {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      // retry with new access token
      const newAccessToken = getStoredAccessToken();
      res = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
          "Content-Type": "application/json",
          ...(newAccessToken
            ? { Authorization: `Bearer ${newAccessToken}` }
            : {}),
          ...(headers ?? {}),
        },
      });
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

async function tryRefreshTokens(): Promise<boolean> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshToken }),
    });

    const text = await res.text();
    const data = text ? safeJsonParse(text) : null;

    if (!res.ok) return false;

    if (isTokenResponse(data)) {
      setAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return true;
    }

    return false;
  } catch {
    return false;
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
