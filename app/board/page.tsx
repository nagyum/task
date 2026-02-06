import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import BoardList from "@/src/components/page/board/BoardList";
import { getBoardCategories, getBoards } from "@/src/api/boardApi";

type Props = {
  searchParams?: Promise<{
    page?: string | string[];
    size?: string | string[];
    debug?: string | string[];
  }>;
};

function toNumber(value: string | string[] | undefined, fallback: number) {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

function decodeJwtPayload(token: string | null | undefined) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = parts[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  try {
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default async function BoardPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const pageParam = toNumber(resolvedSearchParams?.page, 1);
  const size = toNumber(resolvedSearchParams?.size, 10);
  const page = Math.max(pageParam - 1, 0);
  const debugParam = Array.isArray(resolvedSearchParams?.debug)
    ? resolvedSearchParams?.debug[0]
    : resolvedSearchParams?.debug;
  const debugEnabled = debugParam === "1" || debugParam === "true";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const cookieNames = cookieStore.getAll().map((cookie) => cookie.name);

  if (!accessToken && !debugEnabled) redirect("/signin");

  const maskToken = (token: string | null | undefined) => {
    if (!token) return "null";
    if (token.length <= 10) return `${token.slice(0, 2)}…`;
    return `${token.slice(0, 6)}…${token.slice(-4)}`;
  };

  const jwtPayload = decodeJwtPayload(accessToken);
  const expSeconds =
    typeof jwtPayload?.exp === "number" ? jwtPayload.exp : null;
  const expDate =
    expSeconds !== null ? new Date(expSeconds * 1000) : null;
  const now = new Date();
  const secondsUntilExp =
    expSeconds !== null ? Math.floor(expSeconds - now.getTime() / 1000) : null;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://front-mission.bigs.or.kr";

  const debugInfo = debugEnabled
    ? {
        hasAccessToken: Boolean(accessToken),
        tokenPreview: maskToken(accessToken),
        tokenLength: accessToken?.length ?? 0,
        cookieNames,
        apiBaseUrl,
        jwtPayload,
        expDate,
        secondsUntilExp,
      }
    : null;

  let list;
  let categories;
  let debugError:
    | {
        status: number | null;
        message: string;
      }
    | null = null;

  try {
    if (accessToken) {
      [list, categories] = await Promise.all([
        getBoards({ page, size }, accessToken),
        getBoardCategories(accessToken),
      ]);
    }
  } catch (err) {
    const status = getErrorStatus(err);

    if ((status === 401 || status === 403) && !debugEnabled) {
      redirect("/signin");
    }

    if (debugEnabled) {
      debugError = {
        status,
        message:
          err instanceof Error
            ? err.message
            : "요청 실패 (오류 메시지 없음)",
      };
    } else {
      throw err;
    }
  }

  return (
    <>
      {debugEnabled && (
        <section
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff8e6",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "12px",
            lineHeight: 1.5,
          }}
        >
          <strong>Debug: /board</strong>
          <div>hasAccessToken: {String(debugInfo?.hasAccessToken)}</div>
          <div>tokenPreview: {debugInfo?.tokenPreview}</div>
          <div>tokenLength: {debugInfo?.tokenLength}</div>
          <div>cookieNames: {debugInfo?.cookieNames.join(", ") || "(none)"}</div>
          <div>apiBaseUrl: {debugInfo?.apiBaseUrl}</div>
          <div>
            jwtPayload:{" "}
            {debugInfo?.jwtPayload
              ? JSON.stringify(debugInfo.jwtPayload)
              : "null"}
          </div>
          <div>
            expDate:{" "}
            {debugInfo?.expDate ? debugInfo.expDate.toISOString() : "null"}
          </div>
          <div>
            secondsUntilExp:{" "}
            {debugInfo?.secondsUntilExp !== null
              ? String(debugInfo?.secondsUntilExp)
              : "null"}
          </div>
          {debugError && (
            <>
              <div>errorStatus: {String(debugError.status)}</div>
              <div>errorMessage: {debugError.message}</div>
            </>
          )}
          {!accessToken && (
            <div>
              accessToken 쿠키가 서버에서 보이지 않습니다. 로그인 후
              새로고침하거나, 쿠키 전달 여부를 확인하세요.
            </div>
          )}
        </section>
      )}
      {list && categories && (
        <BoardList data={list} categories={categories} page={page} size={size} />
      )}
    </>
  );
}
