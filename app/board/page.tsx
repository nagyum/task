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

  const debugInfo = debugEnabled
    ? {
        hasAccessToken: Boolean(accessToken),
        tokenPreview: maskToken(accessToken),
        tokenLength: accessToken?.length ?? 0,
        cookieNames,
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
