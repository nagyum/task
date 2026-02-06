"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BoardDetail from "./BoardDetail";
import BoardDetailSkeleton from "./BoardDetailSkeleton";
import type { BoardCategoryMap, BoardDetail as BoardDetailType } from "@/src/types/board";
import { getBoardById, getBoardCategories } from "@/src/api/boardApi";
import { getStoredAccessToken, refreshAuthTokens } from "@/src/api/client";
import style from "./BoardDetail.module.scss";

type Props = {
  id: number;
};

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default function BoardDetailClient({ id }: Props) {
  const router = useRouter();
  const [board, setBoard] = useState<BoardDetailType | null>(null);
  const [categories, setCategories] = useState<BoardCategoryMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setErrorMessage(null);

      let accessToken = getStoredAccessToken();
      if (!accessToken) {
        const refreshed = await refreshAuthTokens();
        if (!cancelled && refreshed) {
          accessToken = getStoredAccessToken();
        }
      }

      if (!accessToken) {
        router.push("/signin");
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      Promise.all([getBoardById(id, { accessToken }), getBoardCategories(accessToken)])
        .then(([boardResult, categoryResult]) => {
          if (cancelled) return;
          setBoard(boardResult);
          setCategories(categoryResult);
        })
        .catch((err) => {
          if (cancelled) return;
          const status = getErrorStatus(err);
          if (status === 401 || status === 403) {
            router.push("/signin");
            return;
          }
          if (status === 404) {
            setErrorMessage("게시글을 찾을 수 없습니다.");
            return;
          }
          setErrorMessage("게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) {
    return <BoardDetailSkeleton />;
  }

  if (!board || !categories) {
    return (
      <div className={style.container}>
        <h1 className={style.title}>게시글</h1>
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
      </div>
    );
  }

  return <BoardDetail board={board} categories={categories} />;
}
