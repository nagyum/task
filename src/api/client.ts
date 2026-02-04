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
};

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers ?? {}),
    },
  });

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
